import { ContentDetailPage } from "../_components/content-detail-page";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ContentHubDetailRoutePage({ params }: PageProps) {
  const { slug } = await params;

  return <ContentDetailPage slug={slug} />;
}
