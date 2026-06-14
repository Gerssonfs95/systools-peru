import { Clock3, Download } from "lucide-react";

export function DownloadButton({
  url,
  detailed = false,
  className = "",
}: {
  url?: string | null;
  detailed?: boolean;
  className?: string;
}) {
  const available = Boolean(url?.trim() && url.trim() !== "#");

  if (!available) {
    return (
      <span
        className={`btn-secondary cursor-not-allowed text-[#8d9bb0] ${className}`}
        aria-disabled="true"
        title="Descarga aún no disponible"
      >
        <Clock3 size={16} />
        Próximamente
      </span>
    );
  }

  return (
    <a
      href={url!}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-primary ${className}`}
    >
      <Download size={16} />
      {detailed ? "Descargar desde fuente externa" : "Descargar"}
    </a>
  );
}
