# Implementation Plan (执行状态追踪)

> 每完成一项，将 `[ ]` 改为 `[x]`。完成后执行 `git add . && git commit -m "阶段[N]: [模块名]"`。

## 执行进度

- [ ] 阶段1：基础工具层 (lib/utils.ts → lib/admin-types.ts → lib/admin-api.ts)
- [ ] 阶段2：UI 组件库 (Card → Skeleton → ErrorBoundary → EmptyState)
- [ ] 阶段3：管理后台增强 (review 重构 → dashboard → content/edit → stats API)
- [ ] 阶段4：全局质量优化 (layout → footer → resources → ai-news)
- [ ] 阶段5：交互体验优化 (plaza → community-map → hooks)
- [ ] 阶段6：收尾验证 (build → lint → 手动测试 → 调整)

---

[Overview]

对 OPC Community 项目进行质量完善和管理后台增强，提升用户体验、代码可维护性和内容管理效率。

当前项目已完成了核心功能的前端实现、Content Hub API 对接及部署，处于功能可用的 MVP 阶段。但存在大量重复代码、缺乏统一的错误处理和加载状态、管理后台功能不完整、部分页面 UI 细节需要打磨等问题。本次计划从"质量完善"和"管理后台"两个维度并行推进，系统性提升工程质量和运营效率。

质量完善覆盖 7 个核心页面/组件级别的提升，管理后台补齐 3 个关键管理模块（内容审核增强、数据统计、内容编辑）。两个方向共享 UI 组件库和工具函数的提取，实现一石二鸟的效果。

[Types]

无新增全局类型定义，主要是对现有类型的补充和接口对齐。

详细变更：
- `ContentHubListItem` 新增 `content` 可选字段对齐：
  ```typescript
  // lib/content-hub-adapter.ts - 无需修改，已包含 content?: string | null
  ```
- 管理后台增设类型统一入口 `lib/admin-types.ts`：
  ```typescript
  export type AdminContentStatus = "draft" | "published" | "rejected" | "archived";
  
  export type AdminReviewItem = {
    id: number;
    source_id: number;
    type: string;
    source_name: string;
    slug: string;
    title: string;
    summary: string | null;
    source_url: string | null;
    published_at: string | null;
    status: AdminContentStatus;
    created_at: string;
    updated_at?: string;
  };
  
  export type AdminReviewResponse = {
    items: AdminReviewItem[];
    page: number;
    pageSize: number;
    filters: {
      status: string;
      sourceId: number | null;
      type: string | null;
    };
  };
  
  export type AdminStatItem = {
    label: string;
    value: number;
    color?: string;
  };
  
  export type DashboardStats = {
    totalContents: number;
    draftCount: number;
    publishedCount: number;
    rejectedCount: number;
    archivedCount: number;
    byType: Record<string, number>;
    recentActivity: Array<{ action: string; timestamp: string; detail: string }>;
  };
  ```

[Files]

对 14 个文件进行新增和修改，涉及组件库提取、UI 优化、管理后台功能补齐三个层面。

详细变更：
1. **新建 `lib/admin-types.ts`** — 管理后台类型定义统一入口
2. **新建 `app/_components/ui/card.tsx`** — 通用卡片组件
3. **新建 `app/_components/ui/loading.tsx`** — 通用加载骨架屏组件
4. **新建 `app/_components/ui/error-boundary.tsx`** — 错误边界组件
5. **新建 `app/_components/ui/empty-state.tsx`** — 空数据状态组件
6. **修改 `app/resources/page.tsx`** — 重构为通用资源列表页面
7. **修改 `app/resources/ai-news/page.tsx`** — AI 资讯列表页优化
8. **修改 `app/plaza/page.tsx`** — 社区广场体验优化
9. **修改 `app/community-map/page.tsx`** — 社区地图页面优化
10. **修改 `app/admin/review/page.tsx`** — 内容审核后台增强
11. **新建 `app/admin/dashboard/page.tsx`** — 数据统计仪表盘
12. **新建 `app/admin/content/edit/[id]/page.tsx`** — 内容编辑页面
13. **新建 `app/api/admin/stats/route.ts`** — 管理后台统计 API
14. **修改 `app/layout.tsx`** — 全局布局优化
15. **修改 `app/_components/footer.tsx`** — 页脚优化
16. **修改 `package.json`** — 添加开发依赖

[Functions]

详细变更：

**新建函数:**

1. `lib/utils.ts`
   - `cn(...inputs: ClassValue[]): string` — classnames 工具函数
   - `formatDate(isoDate: string | null | undefined, format?: Intl.DateTimeFormatOptions): string` — 统一日期格式化
   - `truncate(str: string, maxLength: number): string` — 文本截断
   - `debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): (...args: Parameters<T>) => void` — 防抖
   - `toLocalDateTime(isoString: string): string` — ISO 转本地日期时间字符串

2. `lib/admin-api.ts`
   - `fetchReviewList`: 获取审核列表
   - `performContentAction`: 执行内容操作
   - `fetchDashboardStats`: 获取统计仪表盘数据
   - `updateContent`: 更新内容

3. `app/_hooks/use-keyboard-nav.ts`
   - `useKeyboardNav`: 键盘导航 hook

[Implementation Order]

1. **基础工具层**：`lib/utils.ts` → `lib/admin-types.ts` → `lib/admin-api.ts`
2. **UI 组件库**：`Card` → `Loading` → `ErrorBoundary` → `EmptyState`
3. **管理后台增强**：`admin/review` → `admin/dashboard` → `admin/content/edit` → `stats API`
4. **全局质量优化**：`layout` → `footer` → `resources` → `ai-news`
5. **交互体验优化**：`plaza` → `community-map` + `hooks`
6. **收尾验证**：build → lint → 手动冒烟 → 调整