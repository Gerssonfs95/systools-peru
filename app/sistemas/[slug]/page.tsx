import { ArrowLeft, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSystems } from "@/lib/data";
export default async function SystemDetail({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=(await getSystems()).find(x=>x.slug===slug);if(!item)notFound();return <section className="container-page max-w-5xl py-16"><Link href="/sistemas" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#62d6ff]"><ArrowLeft size={16}/> Volver a sistemas</Link><div className="card overflow-hidden"><Image src={item.image_url} alt={item.name} width={1200} height={600} className="max-h-[450px] w-full object-cover"/><div className="p-7 md:p-10"><span className="text-sm font-black text-[#62d6ff]">{item.category} · Versión {item.version}</span><h1 className="mt-3 text-4xl font-black">{item.name}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-[#9aa8bc]">{item.description}</p><a href={item.download_url} target="_blank" rel="noreferrer" className="btn-primary mt-7"><Download size={18}/> Descargar desde fuente externa</a></div></div></section>}
