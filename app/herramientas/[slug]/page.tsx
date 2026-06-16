import type { Metadata } from "next";
import { ArrowLeft, Clock3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CvPdfGenerator } from "@/components/cv-pdf-generator";
import { DrywallCalculator } from "@/components/drywall-calculator";
import { ElectricityConsumptionCalculator } from "@/components/electricity-consumption-calculator";
import { IgvCalculator } from "@/components/igv-calculator";
import { LoanCalculator } from "@/components/loan-calculator";
import { PasswordGenerator } from "@/components/password-generator";
import { PcPowerSupplyCalculator } from "@/components/pc-power-supply-calculator";
import { ProfitMarginCalculator } from "@/components/profit-margin-calculator";
import { QuotePdfGenerator } from "@/components/quote-pdf-generator";
import { getTool } from "@/lib/data";

const functionalTools: Record<string, React.ReactNode> = {
  "calculadora-consumo-electrico": <ElectricityConsumptionCalculator />,
  "calculadora-drywall": <DrywallCalculator />,
  "calculadora-igv-peru": <IgvCalculator />,
  "calculadora-margen-ganancia": <ProfitMarginCalculator />,
  "calculadora-prestamos": <LoanCalculator />,
  "generador-contrasenas": <PasswordGenerator />,
  "generador-cotizaciones-pdf": <QuotePdfGenerator />,
  "generador-cv-pdf": <CvPdfGenerator />,
  "calculadora-fuente-pc": <PcPowerSupplyCalculator />,
};

const seoBySlug: Record<string, Metadata> = {
  "generador-cotizaciones-pdf": {
    title: "Generador de Cotizaciones PDF Gratis | SysTools Perú",
    description: "Crea cotizaciones profesionales gratis desde tu navegador y descárgalas en PDF.",
  },
  "generador-cv-pdf": {
    title: "Generador de CV PDF Gratis | SysTools Perú",
    description: "Crea tu currículum vitae profesional gratis desde tu navegador y descárgalo en PDF.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return seoBySlug[slug] ?? {};
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await getTool(slug);
  if (!tool) notFound();

  return <section className="container-page max-w-5xl py-14 md:py-20">
    <Link href="/herramientas" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#62d6ff]"><ArrowLeft size={16} /> Volver a herramientas</Link>
    <div className="mb-9"><span className="text-xs font-black uppercase tracking-[.2em] text-[#62d6ff]">{tool.category}</span><h1 className="text-gradient mt-3 text-4xl font-black tracking-tight md:text-6xl">{tool.name}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-[#98a7bc]">{tool.description}</p></div>
    {functionalTools[slug] ?? <ComingSoon />}
  </section>;
}

function ComingSoon() {
  return <div className="card grid min-h-72 place-items-center p-8 text-center"><div><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#16a8ff]/10 text-[#62d6ff]"><Clock3 size={30} /></span><h2 className="mt-6 text-2xl font-black">Herramienta próximamente</h2><p className="mx-auto mt-3 max-w-lg leading-7 text-[#91a0b5]">Estamos preparando esta herramienta para que sea clara, rápida y útil. Muy pronto estará disponible.</p></div></div>;
}
