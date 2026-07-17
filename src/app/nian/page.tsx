import type { Metadata } from "next";
import { PRODUCT_CONTENT } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";

// 无为·念（AI 时代语音输入）
const c = PRODUCT_CONTENT.nian.zh;

export const revalidate = 60;

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: { canonical: "https://wuweiai.io/nian" },
  openGraph: { title: c.meta.title, description: c.meta.description, url: "https://wuweiai.io/nian" },
};

export default function Page() {
  return <ProductPage content={c} locale="zh" trackPath="/nian" downloadHref="/#download" />;
}
