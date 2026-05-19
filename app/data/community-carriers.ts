export type CommunityCarrierItem = {
  id: string;
  slug: string;
  name: string;
  district: string;
  address: string;
  summary: string;
  capabilities: string[];
  coverImage?: string;
  coverImageAlt?: string;
};

export const defaultCommunityCarriers: CommunityCarrierItem[] = [
  {
    id: "carrier-nansha-talent-harbor",
    slug: "nansha-talent-harbor",
    name: "南沙区人才港",
    district: "南沙区",
    address: "广州市南沙区人才港",
    summary: "作为 OPC 社区主载体，承接主题沙龙、项目路演与协作对接等活动。",
    capabilities: ["线下活动", "项目路演", "协作对接"],
    coverImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "现代化线下交流空间",
  },
  {
    id: "carrier-tianhe-innovation-space",
    slug: "tianhe-innovation-space",
    name: "天河创新交流空间",
    district: "天河区",
    address: "广州市天河区珠江新城创新空间",
    summary: "重点服务技术分享与企业协作，适合举办中小规模专题工作坊与闭门会。",
    capabilities: ["技术工作坊", "企业协作", "专题闭门会"],
    coverImage: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "开放式协作办公与会议空间",
  },
  {
    id: "carrier-haizhu-digital-hub",
    slug: "haizhu-digital-hub",
    name: "海珠数字共创中心",
    district: "海珠区",
    address: "广州市海珠区琶洲数字产业园",
    summary: "面向开源生态与高校团队，支持联合开发、Demo 展示和成果交流。",
    capabilities: ["开源共创", "高校协作", "Demo 展示"],
    coverImage: "https://images.unsplash.com/photo-1522071901873-411886a10004?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "团队共创与展示讨论场景",
  },
];

export async function listCommunityCarriers(): Promise<CommunityCarrierItem[]> {
  return defaultCommunityCarriers;
}
