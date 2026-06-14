import { DownloadCard } from "@/components/content-cards";
import { PageHero } from "@/components/page-hero";
import { getDownloads } from "@/lib/data";
export default async function DownloadsPage(){const items=await getDownloads();return <><PageHero eyebrow="Descargas" title="Recursos confiables, listos para usar" description="Accede a utilidades, paquetes y recursos alojados en plataformas externas seguras."/><section className="container-page grid gap-5 py-10 md:grid-cols-2 lg:grid-cols-3">{items.map(x=><DownloadCard key={x.id} item={x}/>)}</section></>}
