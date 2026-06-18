import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";
import { ErrorBoundary } from "./_components/ui/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "广州人工智能 OPC 社区",
  description:
    "广州人工智能 OPC 社区 - 探索 AI 无限可能，汇聚本地 AI 爱好者、开发者与研究者，共建开放协作的人工智能生态",
  keywords: ["广州AI", "人工智能", "OPC社区", "AI开发者", "技术社区"],
  openGraph: {
    title: "广州人工智能 OPC 社区",
    description:
      "探索 AI 无限可能，汇聚本地 AI 爱好者、开发者与研究者，共建开放协作的人工智能生态",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <ErrorBoundary>
          <main className="pt-16 flex-1">{children}</main>
        </ErrorBoundary>
        <Footer />
      </body>
    </html>
  );
}
