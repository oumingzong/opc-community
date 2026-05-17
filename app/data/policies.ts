export type PolicyItem = {
  title: string;
  level: string;
  issuer: string;
  date: string;
  docNo?: string;
  summary: string;
  url: string;
};

export const cityPolicies: PolicyItem[] = [
  {
    title: "广州市人民政府办公厅关于印发广州市促进人工智能产业高质量发展实施方案的通知",
    level: "市级政策（正式文件）",
    issuer: "广州市人民政府办公厅",
    date: "2026-03-26",
    docNo: "穗府办函〔2026〕10号",
    summary:
      "明确广州人工智能发展路线，提出2027年“六个一”与2030年“十百千万”目标，覆盖算力、数据、模型、场景、人才与生态等全链条任务。",
    url: "https://www.gz.gov.cn/gzzcwjk/gzdata/content/post_10743473.html",
  },
  {
    title: "【政策解读】关于《广州市促进人工智能产业高质量发展实施方案》政策解读",
    level: "市级政策（官方解读）",
    issuer: "广州市发展和改革委员会",
    date: "2026-03-26",
    summary:
      "对实施方案的起草背景、目标体系和重点工程进行了官方说明，可用于快速理解政策重点与执行方向。",
    url: "https://www.gz.gov.cn/zwgk/zcjd/zcjd/content/post_10743566.html",
  },
  {
    title: "《广州市人工智能产业2026年工作要点》出炉",
    level: "市级政策（年度工作部署）",
    issuer: "广州市人工智能产业发展办公室（发布信息来源：广州日报）",
    date: "2026-05-12",
    summary:
      "围绕“十百千”目标细化当年任务，提出打造平台、培育模型、开放场景等年度指标，强调产业落地与场景牵引。",
    url: "https://www.gz.gov.cn/zt/gzlfzgzld/gzld/content/post_10807818.html",
  },
];

export const districtPolicies: PolicyItem[] = [
  {
    title:
      "广州市海珠区发展和改革局 广州市海珠区科技工业商务和信息化局 广州市海珠区人工智能发展局关于印发广州市海珠区推动前沿产业创新发展若干措施的通知",
    level: "区级政策（正式文件）",
    issuer: "广州市海珠区发展和改革局等",
    date: "2026-03-30",
    docNo: "海发改规字〔2026〕1号",
    summary:
      "文件状态为有效，聚焦低空经济、具身智能、脑机接口等前沿方向，设置技术攻关、场景建设与企业培育支持条款。",
    url: "https://www.gz.gov.cn/gfxwj/qjgfxwj/hzq/qbm/content/post_10748047.html",
  },
  {
    title: "白云区全链发力护航人工智能产业发展",
    level: "区级政策（发布动态）",
    issuer: "白云区",
    date: "2026-04-29",
    summary:
      "政务动态披露白云区已正式印发《广州市白云区支持人工智能和数据产业高质量发展若干措施》，提到算力券、数据券和场景奖补等支持方向。",
    url: "https://www.gz.gov.cn/ysgz/xwdt/ysdt/content/post_10792067.html",
  },
];

export const allPolicies: PolicyItem[] = [...cityPolicies, ...districtPolicies];

export function getPolicyPreview(count = 3): PolicyItem[] {
  return [...allPolicies]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
