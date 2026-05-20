export type PlazaPost = {
  id: string;
  author: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
};

export type PlazaComment = {
  id: string;
  postId: string;
  user: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
  replies?: PlazaComment[];
};

export type CreatePlazaPostInput = {
  author: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
};

export type CreatePlazaCommentInput = {
  postId: string;
  content: string;
  user: string;
  avatar: string;
  parentId?: string;
};

const STORAGE_KEY = "opc_plaza_posts";
const COMMENT_STORAGE_KEY = "opc_plaza_comments";
const REQUEST_TIMEOUT_MS = 6000;

const seedPosts: PlazaPost[] = [
  {
    id: "seed-1",
    author: "南沙AI实践营",
    title: "周末一起做一个本地知识库 Agent",
    content:
      "我们会从 0 到 1 跑通检索、重排和回答链路，适合刚入门 RAG 的同学，欢迎带电脑来现场实战。",
    images: ["https://picsum.photos/800/1000?random=21"],
    tags: ["#Agent", "#RAG", "#线下活动"],
    likes: 126,
    comments: 34,
    createdAt: "2 小时前",
  },
  {
    id: "seed-2",
    author: "天河模型小组",
    title: "分享一个中文评测提示词模板",
    content:
      "这套模板在客服问答场景里效果稳定，重点是把评分标准拆成可观测维度，欢迎大家拿去改。",
    images: ["https://picsum.photos/800/900?random=22"],
    tags: ["#提示词", "#评测", "#实战"],
    likes: 88,
    comments: 19,
    createdAt: "5 小时前",
  },
  {
    id: "seed-3",
    author: "海珠开源夜话",
    title: "开源项目协作招募：中文多模态数据清洗",
    content:
      "我们正在整理多模态样本清洗规则，目标是形成一套可复用的开源流程，欢迎数据工程同学加入。",
    images: ["https://picsum.photos/800/1100?random=23"],
    tags: ["#开源", "#多模态", "#协作"],
    likes: 142,
    comments: 27,
    createdAt: "昨天",
  },
];

const seedCommentsByPostId: Record<string, PlazaComment[]> = {
  "seed-1": [
    {
      id: "cm-1",
      postId: "seed-1",
      user: "广州AI爱好者",
      avatar: "https://picsum.photos/80/80?random=401",
      content: "这个观点很实用，已收藏准备实战。",
      createdAt: "5 分钟前",
      likes: 16,
    },
    {
      id: "cm-2",
      postId: "seed-1",
      user: "南沙开发者",
      avatar: "https://picsum.photos/80/80?random=402",
      content: "能再展开讲讲你的实现细节吗？",
      createdAt: "18 分钟前",
      likes: 9,
    },
    {
      id: "cm-3",
      postId: "seed-1",
      user: "模型调参小队",
      avatar: "https://picsum.photos/80/80?random=403",
      content: "标签很精准，期待你后续更新。",
      createdAt: "1 小时前",
      likes: 5,
    },
  ],
};

function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_PLAZA_POST_API_URL?.trim() ?? "";
}

function createTimeoutSignal(timeoutMs: number): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timer),
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readLocalPosts(): PlazaPost[] {
  if (!isBrowser()) {
    return seedPosts;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedPosts));
    return seedPosts;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return seedPosts;
    }
    return parsed as PlazaPost[];
  } catch {
    return seedPosts;
  }
}

function writeLocalPosts(posts: PlazaPost[]): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function readLocalCommentsByPost(): Record<string, PlazaComment[]> {
  if (!isBrowser()) {
    return seedCommentsByPostId;
  }

  const raw = window.localStorage.getItem(COMMENT_STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(COMMENT_STORAGE_KEY, JSON.stringify(seedCommentsByPostId));
    return seedCommentsByPostId;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return seedCommentsByPostId;
    }
    return parsed as Record<string, PlazaComment[]>;
  } catch {
    return seedCommentsByPostId;
  }
}

function writeLocalCommentsByPost(commentsByPost: Record<string, PlazaComment[]>): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(COMMENT_STORAGE_KEY, JSON.stringify(commentsByPost));
}

function appendReplyToCommentTree(comments: PlazaComment[], parentId: string, reply: PlazaComment): PlazaComment[] {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [...(comment.replies ?? []), reply],
      };
    }

    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: appendReplyToCommentTree(comment.replies, parentId, reply),
      };
    }

    return comment;
  });
}

function updateCommentLikeInTree(comments: PlazaComment[], commentId: string, delta: number): PlazaComment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return {
        ...comment,
        likes: Math.max(0, comment.likes + delta),
      };
    }

    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentLikeInTree(comment.replies, commentId, delta),
      };
    }

    return comment;
  });
}

async function fetchListFromApi(apiUrl: string): Promise<PlazaPost[]> {
  const { signal, clear } = createTimeoutSignal(REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(apiUrl, { method: "GET", signal, cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Plaza list request failed: ${response.status}`);
    }
    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error("Plaza list response shape is invalid");
    }
    return payload as PlazaPost[];
  } finally {
    clear();
  }
}

async function createPostToApi(apiUrl: string, input: CreatePlazaPostInput): Promise<PlazaPost> {
  const { signal, clear } = createTimeoutSignal(REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`Plaza create request failed: ${response.status}`);
    }

    const payload: unknown = await response.json();
    return payload as PlazaPost;
  } finally {
    clear();
  }
}

async function fetchCommentsFromApi(apiUrl: string, postId: string): Promise<PlazaComment[]> {
  const { signal, clear } = createTimeoutSignal(REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${apiUrl}/${postId}/comments`, {
      method: "GET",
      signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Plaza comments request failed: ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error("Plaza comments response shape is invalid");
    }
    return payload as PlazaComment[];
  } finally {
    clear();
  }
}

async function createCommentToApi(apiUrl: string, input: CreatePlazaCommentInput): Promise<PlazaComment> {
  const { signal, clear } = createTimeoutSignal(REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${apiUrl}/${input.postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`Plaza comment create request failed: ${response.status}`);
    }

    const payload: unknown = await response.json();
    return payload as PlazaComment;
  } finally {
    clear();
  }
}

async function togglePostLikeToApi(apiUrl: string, postId: string, liked: boolean): Promise<void> {
  const { signal, clear } = createTimeoutSignal(REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${apiUrl}/${postId}/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({ liked }),
    });
    if (!response.ok) {
      throw new Error(`Plaza post like request failed: ${response.status}`);
    }
  } finally {
    clear();
  }
}

async function toggleCommentLikeToApi(apiUrl: string, postId: string, commentId: string, liked: boolean): Promise<void> {
  const { signal, clear } = createTimeoutSignal(REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${apiUrl}/${postId}/comments/${commentId}/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({ liked }),
    });
    if (!response.ok) {
      throw new Error(`Plaza comment like request failed: ${response.status}`);
    }
  } finally {
    clear();
  }
}

export async function listPlazaPosts(): Promise<PlazaPost[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    return readLocalPosts();
  }

  try {
    return await fetchListFromApi(apiUrl);
  } catch {
    return readLocalPosts();
  }
}

export async function createPlazaPost(input: CreatePlazaPostInput): Promise<PlazaPost> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    const fallbackImage = `https://picsum.photos/800/${860 + Math.floor(Math.random() * 240)}?random=${Date.now()}`;
    const localPost: PlazaPost = {
      id: `post-${Date.now()}`,
      author: input.author,
      title: input.title,
      content: input.content,
      images: input.images.length > 0 ? input.images : [fallbackImage],
      tags: input.tags,
      likes: 0,
      comments: 0,
      createdAt: "刚刚",
    };

    const previous = readLocalPosts();
    const next = [localPost, ...previous];
    writeLocalPosts(next);
    return localPost;
  }

  try {
    return await createPostToApi(apiUrl, input);
  } catch {
    const fallbackImage = `https://picsum.photos/800/${860 + Math.floor(Math.random() * 240)}?random=${Date.now()}`;
    const localPost: PlazaPost = {
      id: `post-${Date.now()}`,
      author: input.author,
      title: input.title,
      content: input.content,
      images: input.images.length > 0 ? input.images : [fallbackImage],
      tags: input.tags,
      likes: 0,
      comments: 0,
      createdAt: "刚刚",
    };
    const previous = readLocalPosts();
    const next = [localPost, ...previous];
    writeLocalPosts(next);
    return localPost;
  }
}

export async function listPlazaComments(postId: string): Promise<PlazaComment[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    const commentsByPost = readLocalCommentsByPost();
    return commentsByPost[postId] ?? [];
  }

  try {
    return await fetchCommentsFromApi(apiUrl, postId);
  } catch {
    const commentsByPost = readLocalCommentsByPost();
    return commentsByPost[postId] ?? [];
  }
}

export async function createPlazaComment(input: CreatePlazaCommentInput): Promise<PlazaComment> {
  const createCommentInLocal = (): PlazaComment => {
    const nextComment: PlazaComment = {
      id: `cm-${Date.now()}`,
      postId: input.postId,
      user: input.user,
      avatar: input.avatar,
      content: input.content,
      createdAt: "刚刚",
      likes: 0,
    };

    const commentsByPost = readLocalCommentsByPost();
    const postComments = commentsByPost[input.postId] ?? [];
    const nextPostComments = input.parentId
      ? appendReplyToCommentTree(postComments, input.parentId, nextComment)
      : [nextComment, ...postComments];

    writeLocalCommentsByPost({
      ...commentsByPost,
      [input.postId]: nextPostComments,
    });

    const posts = readLocalPosts();
    const postIndex = posts.findIndex((item) => item.id === input.postId);
    if (postIndex >= 0) {
      const nextPosts = [...posts];
      nextPosts[postIndex] = {
        ...nextPosts[postIndex],
        comments: nextPosts[postIndex].comments + 1,
      };
      writeLocalPosts(nextPosts);
    }

    return nextComment;
  };

  const apiUrl = getApiUrl();
  if (!apiUrl) {
    return createCommentInLocal();
  }

  try {
    return await createCommentToApi(apiUrl, input);
  } catch {
    return createCommentInLocal();
  }
}

export async function togglePlazaPostLike(postId: string, liked: boolean): Promise<void> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    const posts = readLocalPosts();
    const postIndex = posts.findIndex((item) => item.id === postId);
    if (postIndex >= 0) {
      const delta = liked ? 1 : -1;
      const nextPosts = [...posts];
      nextPosts[postIndex] = {
        ...nextPosts[postIndex],
        likes: Math.max(0, nextPosts[postIndex].likes + delta),
      };
      writeLocalPosts(nextPosts);
    }
    return;
  }

  try {
    await togglePostLikeToApi(apiUrl, postId, liked);
  } catch {
    const posts = readLocalPosts();
    const postIndex = posts.findIndex((item) => item.id === postId);
    if (postIndex >= 0) {
      const delta = liked ? 1 : -1;
      const nextPosts = [...posts];
      nextPosts[postIndex] = {
        ...nextPosts[postIndex],
        likes: Math.max(0, nextPosts[postIndex].likes + delta),
      };
      writeLocalPosts(nextPosts);
    }
  }
}

export async function togglePlazaCommentLike(
  postId: string,
  commentId: string,
  liked: boolean
): Promise<void> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    const commentsByPost = readLocalCommentsByPost();
    const postComments = commentsByPost[postId] ?? [];
    const delta = liked ? 1 : -1;
    const nextPostComments = updateCommentLikeInTree(postComments, commentId, delta);
    writeLocalCommentsByPost({
      ...commentsByPost,
      [postId]: nextPostComments,
    });
    return;
  }

  try {
    await toggleCommentLikeToApi(apiUrl, postId, commentId, liked);
  } catch {
    const commentsByPost = readLocalCommentsByPost();
    const postComments = commentsByPost[postId] ?? [];
    const delta = liked ? 1 : -1;
    const nextPostComments = updateCommentLikeInTree(postComments, commentId, delta);
    writeLocalCommentsByPost({
      ...commentsByPost,
      [postId]: nextPostComments,
    });
  }
}
