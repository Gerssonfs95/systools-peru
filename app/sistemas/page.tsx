import { SystemCard } from "@/components/content-cards";
import { PageHero } from "@/components/page-hero";
import { getSystems } from "@/lib/data";
export default async function SystemsPage(){const items=await getSystems();return <><PageHero eyebrow="Sistemas" title="Software pensado para resolver" description="Explora soluciones digitales listas para mejorar procesos, organizar información y ahorrar tiempo."/><section className="container-page grid gap-5 py-10 md:grid-cols-2 lg:grid-cols-3">{items.map(x=><SystemCard key={x.id} item={x}/>)}</section></>}
