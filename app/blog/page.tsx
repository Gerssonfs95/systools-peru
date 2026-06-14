import { PostCard } from "@/components/content-cards";
import { PageHero } from "@/components/page-hero";
import { getPosts } from "@/lib/data";
export default async function BlogPage(){const items=await getPosts();return <><PageHero eyebrow="Blog y noticias" title="Ideas para entender y aprovechar la tecnología" description="Tutoriales, noticias y recomendaciones explicadas con claridad."/><section className="container-page grid gap-5 py-10 md:grid-cols-2 lg:grid-cols-3">{items.map(x=><PostCard key={x.id} item={x}/>)}</section></>}
