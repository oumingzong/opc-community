import { ExternalLink, Building2, FileText, CalendarDays } from "lucide-react";
import { cityPolicies, districtPolicies, type PolicyItem } from "../data/policies";

function PolicyCard({ item }: { item: PolicyItem }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          {item.level}
        </span>
        {item.docNo && (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {item.docNo}
          </span>
        )}
      </div>

      <h2 className="text-lg font-bold text-gray-900 leading-snug">{item.title}</h2>

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="inline-flex items-center gap-1">
          <Building2 className="w-4 h-4" />
          {item.issuer}
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="w-4 h-4" />
          {item.date}
        </span>
      </div>

      <p className="mt-4 text-sm text-gray-600 leading-relaxed">{item.summary}</p>

      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        查看官方原文
        <ExternalLink className="w-4 h-4" />
      </a>
    </article>
  );
}

export default function PolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
            <FileText className="w-4 h-4" />
            相关政策
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900">广州人工智能相关政策</h1>
          <p className="mt-3 text-gray-600 max-w-3xl leading-relaxed">
            本页汇总可公开查询的广州人工智能政策与政策解读，优先收录市政府官网和规范性文件平台来源，便于你快速查阅政策原文。
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">市级政策</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {cityPolicies.map((item) => (
              <PolicyCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">区级政策</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {districtPolicies.map((item) => (
              <PolicyCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
