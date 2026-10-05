import { notFound } from "next/navigation";
import { isLocale, messages, type Locale } from "../../i18n";
import { createPageMetadata } from "../../seo";
import { LocalizedStyleBuilderPage } from "../../style-builder/page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const copy = messages[locale];
  const title = `${copy.builder.lineOne} ${copy.builder.lineTwo} · Plotbeat`;
  const description = copy.metaDescription;
  return createPageMetadata({ title, description, path: `/${locale}/style-builder`, locale });
}

export default async function LocalizedBuilder({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return <LocalizedStyleBuilderPage locale={locale as Locale} />;
}
