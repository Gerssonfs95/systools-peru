import { ArrowRight, BriefcaseBusiness, Gamepad2, Network, Settings2, Wrench } from "lucide-react";
import Link from "next/link";
import { DownloadCard, PostCard, SystemCard, ToolCard } from "@/components/content-cards";
import { SectionHeading } from "@/components/section-heading";
import { getDownloads, getPosts, getSystems, getTools } from "@/lib/data";

const categories = [
  { name:"Sistemas", text:"Soluciones digitales para ordenar y simplificar.", icon:Settings2, href:"/sistemas" },
  { name:"Herramientas", text:"Utilidades prácticas para resolver más rápido.", icon:Wrench, href:"/herramientas" },
  { name:"Redes", text:"Recursos para conectar y optimizar.", icon:Network, href:"/blog" },
  { name:"Gaming", text:"Contenido y recursos para jugadores.", icon:Gamepad2, href:"/descargas" },
  { name:"Negocios", text:"Tecnología que acompaña tu crecimiento.", icon:BriefcaseBusiness, href:"/blog" },
];

export default async function Home() {
  const [systems, tools, posts, downloads] = await Promise.all([getSystems(), getTools(), getPosts(), getDownloads()]);
  return <>
    <section className="container-page relative grid min-h-[650px] items-center py-20 lg:grid-cols-[1.2fr_.8fr]">
      <div><div className="mb-6 inline-flex rounded-full border border-[#16a8ff]/20 bg-[#16a8ff]/5 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#62d6ff]">Tecnología útil para todos</div><h1 className="text-gradient max-w-4xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">Herramientas que potencian tus ideas</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[#9aa9bd]">Sistemas, herramientas digitales, descargas y contenido tecnológico para ayudarte a crear, resolver y avanzar.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/herramientas" className="btn-primary">Ver herramientas <ArrowRight size={18}/></Link><Link href="/descargas" className="btn-secondary">Ver descargas</Link></div></div>
      <div className="relative mx-auto mt-14 grid aspect-square w-full max-w-[390px] place-items-center lg:mt-0"><div className="absolute inset-8 rounded-full border border-[#16a8ff]/20 shadow-[0_0_90px_rgba(22,168,255,.16)]"/><div className="absolute inset-20 rounded-full border border-dashed border-[#62d6ff]/25"/><div className="grid size-40 place-items-center rounded-[2.5rem] border border-[#62d6ff]/30 bg-[#0d1728] shadow-[0_0_60px_rgba(22,168,255,.25)]"><Settings2 className="text-[#62d6ff]" size={72}/></div></div>
    </section>
    <section className="container-page py-14"><SectionHeading eyebrow="Explora" title="Todo lo que necesitas, en un solo lugar"/><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{categories.map(({name,text,icon:Icon,href})=><Link href={href} className="card p-5" key={name}><Icon className="mb-5 text-[#62d6ff]"/><h3 className="font-black">{name}</h3><p className="mt-2 text-sm leading-6 text-[#8492a8]">{text}</p></Link>)}</div></section>
    <section className="container-page py-14"><SectionHeading eyebrow="Soluciones" title="Sistemas destacados" href="/sistemas"/><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{systems.slice(0,3).map(x=><SystemCard key={x.id} item={x}/>)}</div></section>
    <section className="container-page py-14"><SectionHeading eyebrow="Utilidades" title="Herramientas en preparación" href="/herramientas"/><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{tools.slice(0,4).map(x=><ToolCard key={x.id} item={x}/>)}</div></section>
    <section className="container-page py-14"><SectionHeading eyebrow="Aprende" title="Últimos artículos" href="/blog"/><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{posts.slice(0,3).map(x=><PostCard key={x.id} item={x}/>)}</div></section>
    <section className="container-page py-14"><SectionHeading eyebrow="Recursos" title="Últimas descargas" href="/descargas"/><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{downloads.slice(0,3).map(x=><DownloadCard key={x.id} item={x}/>)}</div></section>
  </>;
}
