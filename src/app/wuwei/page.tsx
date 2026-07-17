import type { Metadata } from "next";
import { PRODUCT_CONTENT } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";

// 无为·客户端本尊（通用 AI Agent，非「编程客户端」——定位以品牌中心产品中心为准）
const c = PRODUCT_CONTENT.wuwei.zh;

export const revalidate = 60;

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: { canonical: "https://wuweiai.io/wuwei" },
  openGraph: { title: c.meta.title, description: c.meta.description, url: "https://wuweiai.io/wuwei" },
};

export default function Page() {
  return <ProductPage content={c} locale="zh" trackPath="/wuwei" downloadHref="/#download" />;
}
