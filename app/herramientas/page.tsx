import { ToolCard } from "@/components/content-cards";
import { PageHero } from "@/components/page-hero";
import { getTools } from "@/lib/data";
export default async function ToolsPage(){const items=await getTools();return <><PageHero eyebrow="Herramientas" title="Utilidades que hacen el trabajo más simple" description="Estamos preparando calculadoras y herramientas digitales útiles para tecnología, redes y negocios."/><section className="container-page grid gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3">{items.map(x=><ToolCard key={x.id} item={x}/>)}</section></>}
