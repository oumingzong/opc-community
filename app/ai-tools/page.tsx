"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ArrowRight,
  Star,
  ExternalLink,
  Filter,
  X,
  Loader,
} from "lucide-react";
import { type AITool, type AIToolListResponse } from "@/app/data/ai-tools";

const CATEGORIES = [
  "文本生成",
  "代码助手",
  "图像生成",
  "数据分析",
  "语音处理",
  "本地部署",
  "其他",
];

const PRICINGS = ["免费", "付费", "免费+付费"];

export default function AIToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从 API 加载工具数据
  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedPricing) params.set("pricing", selectedPricing);
        if (searchQuery) params.set("q", searchQuery);

        const response = await fetch(`/api/ai-tools?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to load AI tools");
        }

        const data: AIToolListResponse = await response.json();
        setTools(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load AI tools");
        console.error("Error loading AI tools:", err);
      } finally {
        setLoading(false);
      }
    };

    // 使用防抖延迟加载，避免频繁请求
    const timer = setTimeout(() => {
      loadTools();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedPricing, searchQuery]);

  // 过滤和搜索逻辑（已通过 API 处理）
  const filteredTools = useMemo(() => {
    let filtered = [...tools];

    // 按评分排序
    return filtered.sort((a, b) => b.rating - a.rating);
  }, [tools]);

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getPricingBadge = (pricing: string) => {
    let bgColor = "bg-blue-50 text-blue-700 border-blue-200";
    if (pricing === "免费") {
      bgColor = "bg-green-50 text-green-700 border-green-200";
    } else if (pricing === "付费") {
      bgColor = "bg-purple-50 text-purple-700 border-purple-200";
    }
    return bgColor;
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-cyan-50/30 py-20">
      {/* Header */}
      <section className="bg-linear-to-r from-blue-50 via-indigo-50 to-sky-50 py-12 px-0 -mx-4 sm:-mx-6 lg:-mx-8 mb-12 sm:rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4">
              AI 工具库
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              发现和对比最热门的 AI 工具，加速你的工作流程。精选了文本生成、代码助手、图像生成等领域的优质工具。
            </p>
          </div>

          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索工具名称、功能或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Filter className="w-4 h-4" />
                    筛选
                  </span>
                  {showMobileFilters ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Filters */}
              <div
                className={`lg:block ${
                  showMobileFilters ? "block" : "hidden"
                } space-y-6 lg:space-y-6`}
              >
                {/* Category Filter */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">工具分类</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === null
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      全部分类
                    </button>
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing Filter */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">价格</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedPricing(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedPricing === null
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      全部价格
                    </button>
                    {PRICINGS.map((pricing) => (
                      <button
                        key={pricing}
                        onClick={() => setSelectedPricing(pricing)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedPricing === pricing
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pricing}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedCategory || selectedPricing) && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedPricing(null);
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    清除筛选
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <Loader className="w-10 h-10 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  正在加载工具...
                </h3>
                <p className="text-gray-600 mb-6">
                  请稍候...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  加载失败
                </h3>
                <p className="text-gray-600 mb-6">
                  {error}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setSelectedPricing(null);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  清除所有筛选
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 font-medium">
                  找到 <span className="font-bold text-gray-900">{filteredTools.length}</span> 个工具
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTools.map((tool: AITool) => (
                    <div
                      key={tool.id}
                      className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {tool.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getPricingBadge(
                                tool.pricing
                              )}`}
                            >
                              {tool.pricing}
                            </span>
                            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {tool.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {tool.description}
                      </p>

                      {/* Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {tool.tags.slice(0, 3).map((tag) => (
                            <span
                              key={`${tool.id}-${tag}`}
                              className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                          {tool.tags.length > 3 && (
                            <span className="text-xs px-2 py-1 text-gray-500">
                              +{tool.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Rating and Stats */}
                      <div className="mb-4 pb-4 border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between">
                          <div>{renderRating(tool.rating)}</div>
                          <span className="text-xs text-gray-500">
                            {tool.usageCount.toLocaleString()} 用户使用
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
                        >
                          访问
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-blue-300 via-indigo-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <section className="mt-20 bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl py-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            发现更多 AI 工具？
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            我们持续为社区成员添加和更新最新的 AI 工具推荐
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-blue-700 font-bold hover:bg-blue-50 transition-colors"
          >
            加入社区了解最新 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
