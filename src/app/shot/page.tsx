import type { Metadata } from "next";
import { PRODUCT_CONTENT } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";

// 无为·截（会思考的截图）
const c = PRODUCT_CONTENT.shot.zh;

export const revalidate = 60;

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: { canonical: "https://wuweiai.io/shot" },
  openGraph: { title: c.meta.title, description: c.meta.description, url: "https://wuweiai.io/shot" },
};

export default function Page() {
  return <ProductPage content={c} locale="zh" trackPath="/shot" downloadHref="/#download" />;
}
