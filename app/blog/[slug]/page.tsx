import { CalendarDays, Tag } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/data";

export default async function PostPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const post=await getPost(slug); if(!post) notFound();
  return <article className="container-page max-w-4xl pt-16"><div className="flex gap-4 text-sm font-bold text-[#8f9db2]"><span className="flex items-center gap-1 text-[#62d6ff]"><Tag size={15}/>{post.category}</span><span className="flex items-center gap-1"><CalendarDays size={15}/>{new Date(post.created_at).toLocaleDateString("es-PE")}</span></div><h1 className="text-gradient mt-5 text-4xl font-black tracking-tight md:text-6xl">{post.title}</h1><p className="mt-5 text-lg leading-8 text-[#9baabd]">{post.excerpt}</p><Image src={post.image_url} alt={post.title} width={1200} height={650} className="mt-10 max-h-[500px] w-full rounded-3xl object-cover"/><div className="prose-content mt-10 text-lg">{post.content.split("\n").map((p,i)=><p key={i}>{p}</p>)}</div></article>;
}
