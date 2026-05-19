import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, Sparkles } from "lucide-react";
import { listCommunityCarriers } from "../data/community-carriers";

function getMapJumpUrl(): string {
  return "https://www.openstreetmap.org/?mlat=22.7905&mlon=113.5403#map=12/22.7905/113.5403";
}

export default async function CommunityMapPage() {
  const carriers = await listCommunityCarriers();

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-cyan-50/30 py-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="relative h-[320px] sm:h-[420px] lg:h-[520px]">
            <div className="pointer-events-none absolute left-6 top-6 rounded-2xl border border-white/20 bg-slate-950/50 px-4 py-3 text-white backdrop-blur-sm sm:left-8 sm:top-8">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-200 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                广州 OPC 社区地图
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">广州人工智能 OPC 社区载体</h1>
              <p className="mt-2 text-sm text-slate-200">当前先加载本地广东省底图，并标出广州南沙区人才港位置</p>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 mb-4">
            <Building2 className="h-3.5 w-3.5" />
            载体介绍
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">广州 OPC 社区载体</h2>
          <p className="mt-3 leading-8 text-slate-600">
            下方按载体分列展示文字与图片。当前为默认数据，后续可直接对接后端接口动态返回载体列表。
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {carriers.map((carrier) => (
              <article
                key={carrier.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image
                    src={carrier.coverImage || "https://picsum.photos/1200/900?grayscale"}
                    alt={carrier.coverImageAlt || `${carrier.name} 载体图片`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900">{carrier.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-7">{carrier.summary}</p>

                  <p className="mt-3 inline-flex items-start gap-2 text-sm text-slate-600 leading-7">
                    {carrier.address}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {carrier.capabilities.map((capability) => (
                      <span
                        key={capability}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}