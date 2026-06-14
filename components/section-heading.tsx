import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ eyebrow, title, href }: { eyebrow: string; title: string; href?: string }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div><p className="mb-2 text-xs font-black uppercase tracking-[.2em] text-[#16a8ff]">{eyebrow}</p><h2 className="text-2xl font-black md:text-3xl">{title}</h2></div>
      {href && <Link href={href} className="hidden items-center gap-1 text-sm font-bold text-[#62d6ff] sm:flex">Ver todo <ArrowRight size={16}/></Link>}
    </div>
  );
}
