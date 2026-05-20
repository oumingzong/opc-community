
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Send, Sparkles, X } from "lucide-react";
import {
  createPlazaComment,
  createPlazaPost,
  listPlazaComments,
  listPlazaPosts,
  togglePlazaCommentLike,
  togglePlazaPostLike,
  type PlazaComment,
  type PlazaPost,
} from "@/lib/plaza-post-service";

const MAX_IMAGES = 9;

export default function PlazaPage() {
  const [posts, setPosts] = useState<PlazaPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePost, setActivePost] = useState<PlazaPost | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [likeAnimating, setLikeAnimating] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<PlazaComment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<PlazaComment | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const sortedPosts = useMemo(() => posts, [posts]);

  useEffect(() => {
    let disposed = false;

    void (async () => {
      const loaded = await listPlazaPosts();
      if (!disposed) {
        setPosts(loaded);
      }
    })();

    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    if (!activePost) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePost(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePost]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activePost?.id]);

  useEffect(() => {
    if (!activePost) {
      return;
    }

    let disposed = false;

    void (async () => {
      const loaded = await listPlazaComments(activePost.id);
      if (!disposed) {
        setComments(loaded);
      }
    })();

    setCommentInput("");
    setReplyingTo(null);
    setExpandedReplies({});

    return () => {
      disposed = true;
    };
  }, [activePost?.id]);

  const publishPost = async () => {
    const nextTitle = title.trim();
    const nextContent = content.trim();

    if (!nextTitle || !nextContent || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const nextPost = await createPlazaPost({
        author: "你",
        title: nextTitle,
        content: nextContent,
        images: selectedImages,
        tags: tags
          .split(/[\s,，]+/)
          .filter(Boolean)
          .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
          .slice(0, 4),
      });

      setPosts((previous) => [nextPost, ...previous]);
      setTitle("");
      setContent("");
      setTags("");
      setSelectedImages([]);
      setUploadError("");
    } catch {
      setUploadError("发布失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSelectImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const remainingSlots = MAX_IMAGES - selectedImages.length;
    if (remainingSlots <= 0) {
      setUploadError(`最多只能上传 ${MAX_IMAGES} 张图片`);
      event.target.value = "";
      return;
    }

    const acceptedFiles = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setUploadError(`最多只能上传 ${MAX_IMAGES} 张图片，已为你保留前 ${remainingSlots} 张`);
    } else {
      setUploadError("");
    }

    const nextImages = await Promise.all(acceptedFiles.map((file) => fileToDataUrl(file)));
    setSelectedImages((previous) => [...previous, ...nextImages].slice(0, MAX_IMAGES));
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setSelectedImages((previous) => previous.filter((_, imageIndex) => imageIndex !== index));
    setUploadError("");
  };

  const pulseLike = (key: string) => {
    setLikeAnimating((previous) => ({ ...previous, [key]: true }));
    window.setTimeout(() => {
      setLikeAnimating((previous) => ({ ...previous, [key]: false }));
    }, 260);
  };

  const togglePostLike = (postId: string) => {
    const nextLiked = !likedPosts[postId];
    pulseLike(`post-${postId}`);
    setLikedPosts((previous) => ({ ...previous, [postId]: nextLiked }));
    void togglePlazaPostLike(postId, nextLiked);
  };

  const toggleCommentLike = (commentId: string) => {
    if (!activePost) {
      return;
    }

    const nextLiked = !likedComments[commentId];
    pulseLike(`comment-${commentId}`);
    setLikedComments((previous) => ({ ...previous, [commentId]: nextLiked }));
    void togglePlazaCommentLike(activePost.id, commentId, nextLiked);
  };

  const startReply = (comment: PlazaComment) => {
    setReplyingTo(comment);
    window.requestAnimationFrame(() => {
      commentInputRef.current?.focus();
    });
  };

  const submitComment = async () => {
    const nextContent = commentInput.trim();
    if (!nextContent || !activePost) {
      return;
    }

    await createPlazaComment({
      postId: activePost.id,
      user: "你",
      avatar: "https://picsum.photos/80/80?random=450",
      content: nextContent,
      parentId: replyingTo?.id,
    });

    const refreshed = await listPlazaComments(activePost.id);
    setComments(refreshed);
    setCommentInput("");
    setReplyingTo(null);
  };

  const toggleRepliesExpand = (commentId: string) => {
    setExpandedReplies((previous) => ({
      ...previous,
      [commentId]: !previous[commentId],
    }));
  };

  const renderComment = (comment: PlazaComment, depth = 0) => {
    const depthClass = depth > 0 ? "ml-6" : "";

    return (
      <div key={`${activePost?.id}-${comment.id}`} className={`rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 ${depthClass}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Image
              src={comment.avatar}
              alt={`${comment.user} 头像`}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
            <p className="text-xs font-semibold text-slate-700">{comment.user}</p>
          </div>
          <p className="text-xs text-slate-400">{comment.createdAt}</p>
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-600">{comment.content}</p>
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
          <button
            className="inline-flex items-center gap-1 transition hover:text-rose-500"
            type="button"
            onClick={() => toggleCommentLike(comment.id)}
          >
            <Heart
              className={`h-3.5 w-3.5 transition-all duration-200 ${
                likedComments[comment.id] ? "fill-rose-500 text-rose-500" : ""
              } ${likeAnimating[`comment-${comment.id}`] ? "scale-125" : "scale-100"}`}
            />
            {comment.likes + (likedComments[comment.id] ? 1 : 0)}
          </button>
          <button
            className="inline-flex items-center gap-1 transition hover:text-slate-700"
            type="button"
            onClick={() => startReply(comment)}
          >
            <MessageCircle className="h-3.5 w-3.5" /> 回复
          </button>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {(expandedReplies[comment.id] ? comment.replies : comment.replies.slice(0, 3)).map((reply) =>
              renderComment(reply, depth + 1)
            )}

            {comment.replies.length > 3 && (
              <button
                type="button"
                onClick={() => toggleRepliesExpand(comment.id)}
                className="ml-6 text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                {expandedReplies[comment.id]
                  ? "收起回复"
                  : `展开更多回复（${comment.replies.length - 3}）`}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-rose-50 via-white to-slate-50 py-10">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            <Sparkles className="h-3.5 w-3.5" />
            交流广场
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            分享你的 AI 学习笔记、项目进展、活动招募和问题求助。发布后会立即出现在广场信息流中。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:h-fit">
            <h2 className="text-lg font-bold text-slate-900">发布新帖子</h2>
            <p className="mt-1 text-xs text-slate-500">标题和正文为必填，标签可用空格分隔。</p>

            <div className="mt-4 space-y-3">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="写一个吸引人的标题"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-rose-200 transition focus:border-rose-300 focus:ring"
              />
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="写下你的观点、问题或活动信息"
                rows={6}
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-rose-200 transition focus:border-rose-300 focus:ring"
              />
              <input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="标签：如 Agent 开源 广州"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-rose-200 transition focus:border-rose-300 focus:ring"
              />

              <div className="rounded-xl border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-700">上传照片（最多 {MAX_IMAGES} 张）</p>
                  <p className="text-xs text-slate-500">{selectedImages.length}/{MAX_IMAGES}</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onSelectImages}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-rose-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:opacity-90"
                />
                {uploadError && <p className="mt-2 text-xs text-rose-600">{uploadError}</p>}

                {selectedImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {selectedImages.map((image, index) => (
                      <div key={`${image}-${index}`} className="relative overflow-hidden rounded-lg border border-slate-200">
                        <div className="relative aspect-square">
                          <Image src={image} alt={`预览图 ${index + 1}`} fill className="object-cover" unoptimized />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white"
                          aria-label={`删除第 ${index + 1} 张图片`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={publishPost}
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-rose-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                <Send className="h-4 w-4" /> {isSubmitting ? "发布中..." : "发布帖子"}
              </button>
            </div>
          </aside>

          <section className="columns-1 gap-5 sm:columns-2 xl:columns-3 [column-fill:_balance]">
            {sortedPosts.map((post) => (
              <article
                key={post.id}
                className="mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm cursor-pointer"
                onClick={() => {
                  setActivePost(post);
                  setActiveImageIndex(0);
                }}
              >
                <div className="relative aspect-[4/5] bg-slate-100">
                  <Image src={post.images[0]} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" unoptimized={post.images[0].startsWith("data:")} />
                </div>

                <div className="p-4">
                  <p className="text-xs font-medium text-slate-500">{post.author} · {post.createdAt}</p>
                  <h3 className="mt-2 text-base font-bold leading-6 text-slate-900">{post.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{post.content}</p>

                  {post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={`${post.id}-${tag}`} className="rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        togglePostLike(post.id);
                      }}
                      className="inline-flex items-center gap-1 transition hover:text-rose-500"
                    >
                      <Heart
                        className={`h-3.5 w-3.5 transition-all duration-200 ${
                          likedPosts[post.id] ? "fill-rose-500 text-rose-500" : ""
                        } ${likeAnimating[`post-${post.id}`] ? "scale-125" : "scale-100"}`}
                      />
                      {post.likes + (likedPosts[post.id] ? 1 : 0)}
                    </button>
                    <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {post.comments}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </section>

      {activePost && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4" onClick={() => setActivePost(null)}>
          <div
            className="h-[75vh] w-[75vw] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid h-full grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
              <div className="relative h-full bg-slate-100">
                <Image
                  src={activePost.images[activeImageIndex]}
                  alt={activePost.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={activePost.images[activeImageIndex].startsWith("data:")}
                />

                {activePost.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((previous) =>
                          previous === 0 ? activePost.images.length - 1 : previous - 1
                        )
                      }
                      className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur hover:bg-black/50"
                      aria-label="上一张图片"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((previous) =>
                          previous === activePost.images.length - 1 ? 0 : previous + 1
                        )
                      }
                      className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur hover:bg-black/50"
                      aria-label="下一张图片"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5 backdrop-blur">
                      {activePost.images.map((image, index) => (
                        <button
                          key={`${activePost.id}-${image}-${index}`}
                          onClick={() => setActiveImageIndex(index)}
                          className={`h-2 rounded-full transition-all ${
                            index === activeImageIndex ? "w-5 bg-white" : "w-2 bg-white/55 hover:bg-white/80"
                          }`}
                          aria-label={`查看第 ${index + 1} 张图片`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="flex h-full min-h-0 flex-col">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={getAuthorAvatar(activePost.author)}
                        alt={`${activePost.author} 头像`}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <p className="text-xs font-medium text-slate-500">{activePost.author} · {activePost.createdAt}</p>
                    </div>
                    <button
                      onClick={() => setActivePost(null)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                      aria-label="关闭帖子详情"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="mt-2 text-xl font-bold leading-8 text-slate-900">{activePost.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{activePost.content}</p>
                  {activePost.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activePost.tags.map((tag) => (
                        <span key={`modal-${activePost.id}-${tag}`} className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                  <h4 className="mb-3 text-sm font-semibold text-slate-900">评论</h4>
                  <div className="space-y-3">
                    {comments.map((comment) => renderComment(comment))}
                  </div>
                </div>

                <div className="border-t border-slate-200 px-5 py-3">
                  {replyingTo && (
                    <div className="mb-2 flex items-center justify-between rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs text-rose-700">
                      <span>正在回复 {replyingTo.user}</span>
                      <button type="button" onClick={() => setReplyingTo(null)} className="font-medium hover:opacity-80">
                        取消
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2">
                    <input
                      ref={commentInputRef}
                      value={commentInput}
                      onChange={(event) => setCommentInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          void submitComment();
                        }
                      }}
                      placeholder={replyingTo ? `回复 ${replyingTo.user}` : "写下你的评论"}
                      className="w-full text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        void submitComment();
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600"
                      aria-label="发送评论"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function getAuthorAvatar(author: string): string {
  const seed = Array.from(author).reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0);
  return `https://picsum.photos/80/80?random=${500 + (seed % 50)}`;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("读取图片失败"));
    reader.readAsDataURL(file);
  });
}
