"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";

const links = [
  ["Inicio", "/"], ["Herramientas", "/herramientas"], ["Sistemas", "/sistemas"],
  ["Descargas", "/descargas"], ["Blog", "/blog"], ["Acerca de", "/acerca-de"], ["Contacto", "/contacto"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="glass sticky top-0 z-50 border-x-0 border-t-0">
      <div className="container-page flex h-18 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map(([label, href]) => <Link key={href} href={href} className="text-sm font-semibold text-[#aebbd0] hover:text-[#62d6ff]">{label}</Link>)}
        </nav>
        <button className="lg:hidden" aria-label="Abrir menú" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="container-page grid gap-1 pb-4 lg:hidden">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-[#c7d3e6] hover:bg-white/5">{label}</Link>)}</nav>}
    </header>
  );
}
