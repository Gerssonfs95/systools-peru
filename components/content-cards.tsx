import { ArrowUpRight, CalendarDays, Download as DownloadIcon, Gauge, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Download, Post, System, Tool } from "@/lib/types";

const placeholder = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80";

export function SystemCard({ item }: { item: System }) {
  return <article className="card overflow-hidden"><Image src={item.image_url || placeholder} alt={item.name} width={700} height={400} className="h-44 w-full object-cover"/><div className="p-5"><div className="mb-3 flex justify-between text-xs font-bold text-[#62d6ff]"><span>{item.category}</span><span>v{item.version}</span></div><h3 className="text-xl font-black">{item.name}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-[#93a1b6]">{item.description}</p><div className="mt-5 flex gap-2"><Link href={`/sistemas/${item.slug}`} className="btn-secondary flex-1 text-sm">Detalles</Link><a href={item.download_url} target="_blank" rel="noreferrer" className="btn-primary flex-1 text-sm"><DownloadIcon size={16}/> Descargar</a></div></div></article>;
}
export function DownloadCard({ item }: { item: Download }) {
  return <article className="card overflow-hidden"><Image src={item.image_url || placeholder} alt={item.name} width={700} height={400} className="h-40 w-full object-cover"/><div className="p-5"><span className="text-xs font-black uppercase tracking-wider text-[#62d6ff]">{item.category}</span><h3 className="mt-2 text-xl font-black">{item.name}</h3><p className="mt-2 text-sm leading-6 text-[#93a1b6]">{item.description}</p><div className="mt-5 flex items-center justify-between"><span className="text-xs font-bold text-[#748299]">Versión {item.version}</span><a href={item.download_url} target="_blank" rel="noreferrer" className="btn-primary text-sm"><DownloadIcon size={16}/> Descargar</a></div></div></article>;
}
export function PostCard({ item }: { item: Post }) {
  return <article className="card overflow-hidden"><Image src={item.image_url || placeholder} alt={item.title} width={800} height={450} className="h-48 w-full object-cover"/><div className="p-5"><div className="flex gap-4 text-xs font-bold text-[#7e8ca2]"><span className="flex items-center gap-1 text-[#62d6ff]"><Tag size={13}/>{item.category}</span><span className="flex items-center gap-1"><CalendarDays size={13}/>{new Date(item.created_at).toLocaleDateString("es-PE")}</span></div><h3 className="mt-3 text-xl font-black leading-tight">{item.title}</h3><p className="mt-3 text-sm leading-6 text-[#93a1b6]">{item.excerpt}</p><Link href={`/blog/${item.slug}`} className="mt-5 inline-flex items-center gap-1 text-sm font-black text-[#62d6ff]">Leer más <ArrowUpRight size={16}/></Link></div></article>;
}
export function ToolCard({ item }: { item: Tool }) {
  return <article className="card p-5"><div className="mb-5 grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Gauge/></div><span className="text-xs font-black uppercase tracking-wider text-[#62d6ff]">{item.category}</span><h3 className="mt-2 text-xl font-black">{item.name}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-[#93a1b6]">{item.description}</p><span className="mt-5 inline-flex rounded-full border border-[#16a8ff]/20 bg-[#16a8ff]/5 px-3 py-1 text-xs font-black text-[#62d6ff]">Próximamente</span></article>;
}
