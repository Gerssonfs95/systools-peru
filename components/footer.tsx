import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#060a12]">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div><Logo /><p className="mt-4 max-w-sm text-sm leading-6 text-[#8795ab]">Tecnología práctica, recursos confiables y soluciones digitales creadas para impulsar tus ideas.</p></div>
        <div><h3 className="mb-4 font-bold">Explorar</h3><div className="grid gap-2 text-sm text-[#8795ab]"><Link href="/herramientas">Herramientas</Link><Link href="/sistemas">Sistemas</Link><Link href="/descargas">Descargas</Link><Link href="/blog">Blog</Link></div></div>
        <div><h3 className="mb-4 font-bold">SysTools Perú</h3><div className="grid gap-2 text-sm text-[#8795ab]"><Link href="/acerca-de">Acerca de</Link><Link href="/contacto">Contacto</Link><Link href="/admin">Administración</Link></div></div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-[#657187]">© {new Date().getFullYear()} SysTools Perú. Todos los derechos reservados.</div>
    </footer>
  );
}
