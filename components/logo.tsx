import { Boxes } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
      <span className="grid size-10 place-items-center rounded-xl bg-[#16a8ff] text-[#03101a] shadow-[0_0_24px_rgba(22,168,255,.32)]">
        <Boxes size={22} />
      </span>
      <span className="text-lg">SysTools <span className="text-[#62d6ff]">Perú</span></span>
    </Link>
  );
}
