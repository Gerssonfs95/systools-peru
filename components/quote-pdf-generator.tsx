"use client";

import { Calculator, FileDown, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type QuoteItem = { id: number; description: string; quantity: string; unitPrice: string };
type PdfConstructor = new (options?: { orientation?: string; unit?: string; format?: string }) => PdfDoc;
type PdfDoc = {
  addImage: (imageData: string, format: string, x: number, y: number, width: number, height: number) => void;
  addPage: () => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  save: (filename: string) => void;
  setDrawColor: (r: number, g: number, b: number) => void;
  setFillColor: (r: number, g: number, b: number) => void;
  setFont: (fontName: string, fontStyle?: string) => void;
  setFontSize: (fontSize: number) => void;
  setTextColor: (r: number, g: number, b: number) => void;
  splitTextToSize: (text: string, maxWidth: number) => string[];
  text: (text: string | string[], x: number, y: number, options?: { align?: string }) => void;
};

declare global {
  interface Window {
    jspdf?: { jsPDF: PdfConstructor };
  }
}

const PEN = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2 });
const today = () => new Date().toISOString().slice(0, 10);
const quoteNumber = () => {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  return `COT-${stamp}`;
};

export function QuotePdfGenerator() {
  const [businessName, setBusinessName] = useState("");
  const [businessDocument, setBusinessDocument] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientDocument, setClientDocument] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [number, setNumber] = useState(quoteNumber());
  const [date, setDate] = useState(today());
  const [validity, setValidity] = useState("7");
  const [observations, setObservations] = useState("Cotización sujeta a disponibilidad y confirmación del cliente.");
  const [includeIgv, setIncludeIgv] = useState(true);
  const [discount, setDiscount] = useState("0");
  const [items, setItems] = useState<QuoteItem[]>([{ id: 1, description: "", quantity: "1", unitPrice: "0" }]);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + toNumber(item.quantity) * toNumber(item.unitPrice), 0);
    const discountAmount = Math.min(toNumber(discount), subtotal);
    const taxable = Math.max(subtotal - discountAmount, 0);
    const igv = includeIgv ? taxable * 0.18 : 0;
    return { subtotal, discountAmount, igv, total: taxable + igv };
  }, [discount, includeIgv, items]);

  function addItem() {
    setItems((current) => [...current, { id: Date.now(), description: "", quantity: "1", unitPrice: "0" }]);
  }

  function removeItem(id: number) {
    setItems((current) => current.length === 1 ? current : current.filter((item) => item.id !== id));
  }

  function updateItem(id: number, key: keyof Omit<QuoteItem, "id">, value: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, [key]: value } : item));
  }

  function validate() {
    if (!clientName.trim()) return "El nombre del cliente es obligatorio.";
    if (items.length === 0) return "Agrega al menos un producto o servicio.";
    if (items.some((item) => !item.description.trim())) return "Cada producto o servicio debe tener una descripción.";
    if (items.some((item) => toNumber(item.quantity) <= 0 || toNumber(item.unitPrice) < 0)) return "Las cantidades deben ser mayores a cero y los precios no pueden ser negativos.";
    if (toNumber(discount) < 0) return "El descuento no puede ser negativo.";
    return "";
  }

  async function generatePdf() {
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    setError("");
    setIsGenerating(true);
    try {
      const jsPDF = await loadJsPdf();
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      await drawPdf(pdf);
      pdf.save(`${number || "cotizacion"}.pdf`);
    } catch {
      setError("No se pudo generar el PDF. Revisa tu conexión e inténtalo nuevamente.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function drawPdf(pdf: PdfDoc) {
    const margin = 14;
    let y = 16;
    pdf.setTextColor(18, 28, 44);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("COTIZACIÓN", margin, y);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(number || "Sin número", 196, y, { align: "right" });

    if (logoUrl.trim()) {
      const logo = await imageToDataUrl(logoUrl.trim());
      if (logo) pdf.addImage(logo, "PNG", 154, 22, 38, 24);
    }

    y += 14;
    pdf.setFont("helvetica", "bold");
    pdf.text(businessName || "Datos del negocio", margin, y);
    pdf.setFont("helvetica", "normal");
    y += 6;
    pdf.text(`RUC/DNI: ${businessDocument || "-"}`, margin, y);
    y += 5;
    pdf.text(`Teléfono: ${businessPhone || "-"}`, margin, y);
    y += 5;
    pdf.text(`Dirección: ${businessAddress || "-"}`, margin, y);

    y += 12;
    sectionTitle(pdf, "Cliente", margin, y);
    y += 7;
    pdf.text(`Nombre: ${clientName}`, margin, y);
    pdf.text(`Documento: ${clientDocument || "-"}`, 112, y);
    y += 5;
    pdf.text(`Teléfono: ${clientPhone || "-"}`, margin, y);
    pdf.text(`Fecha: ${date || "-"}`, 112, y);
    y += 5;
    pdf.text(`Validez: ${validity || "0"} días`, margin, y);

    y += 11;
    tableHeader(pdf, y);
    y += 8;
    items.forEach((item, index) => {
      if (y > 258) {
        pdf.addPage();
        y = 18;
        tableHeader(pdf, y);
        y += 8;
      }
      const subtotal = toNumber(item.quantity) * toNumber(item.unitPrice);
      const description = pdf.splitTextToSize(item.description, 84);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(String(index + 1), margin + 2, y);
      pdf.text(description, margin + 12, y);
      pdf.text(formatNumber(toNumber(item.quantity)), 126, y, { align: "right" });
      pdf.text(PEN.format(toNumber(item.unitPrice)), 158, y, { align: "right" });
      pdf.text(PEN.format(subtotal), 195, y, { align: "right" });
      y += Math.max(8, description.length * 4.5);
    });

    y += 4;
    if (y > 238) {
      pdf.addPage();
      y = 20;
    }
    totalLine(pdf, "Subtotal", totals.subtotal, y); y += 6;
    totalLine(pdf, "Descuento", totals.discountAmount, y); y += 6;
    totalLine(pdf, "IGV 18%", totals.igv, y); y += 8;
    pdf.setFillColor(22, 168, 255);
    pdf.setTextColor(3, 16, 26);
    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL", 142, y);
    pdf.text(PEN.format(totals.total), 195, y, { align: "right" });
    pdf.setTextColor(18, 28, 44);

    if (observations.trim()) {
      y += 14;
      sectionTitle(pdf, "Observaciones", margin, y);
      y += 7;
      pdf.setFont("helvetica", "normal");
      pdf.text(pdf.splitTextToSize(observations, 180), margin, y);
    }
  }

  function clear() {
    setBusinessName(""); setBusinessDocument(""); setBusinessPhone(""); setBusinessAddress(""); setLogoUrl("");
    setClientName(""); setClientDocument(""); setClientPhone(""); setNumber(quoteNumber()); setDate(today());
    setValidity("7"); setObservations("Cotización sujeta a disponibilidad y confirmación del cliente.");
    setIncludeIgv(true); setDiscount("0"); setItems([{ id: 1, description: "", quantity: "1", unitPrice: "0" }]);
    setError("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
      <form className="grid gap-6" onSubmit={(event) => event.preventDefault()}>
        <Card title="Datos del negocio">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nombre del negocio" value={businessName} onChange={setBusinessName} />
            <Input label="RUC o DNI" value={businessDocument} onChange={setBusinessDocument} />
            <Input label="Teléfono" value={businessPhone} onChange={setBusinessPhone} />
            <Input label="Dirección" value={businessAddress} onChange={setBusinessAddress} />
            <div className="sm:col-span-2"><Input label="Logo URL opcional" value={logoUrl} onChange={setLogoUrl} placeholder="https://..." /></div>
          </div>
        </Card>

        <Card title="Datos del cliente">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Nombre del cliente" value={clientName} onChange={setClientName} required />
            <Input label="Documento del cliente" value={clientDocument} onChange={setClientDocument} />
            <Input label="Teléfono del cliente" value={clientPhone} onChange={setClientPhone} />
          </div>
        </Card>

        <Card title="Datos de la cotización">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Número de cotización" value={number} onChange={setNumber} />
            <Input label="Fecha" type="date" value={date} onChange={setDate} />
            <Input label="Validez en días" type="number" value={validity} onChange={setValidity} />
            <div className="sm:col-span-3"><label className="label">Observaciones</label><textarea className="input min-h-24" value={observations} onChange={(event) => setObservations(event.target.value)} /></div>
          </div>
        </Card>

        <Card title="Productos o servicios">
          <div className="grid gap-3">
            {items.map((item) => <div key={item.id} className="grid gap-3 rounded-2xl border border-white/10 bg-[#080e19] p-4 md:grid-cols-[1fr_90px_120px_120px_auto]">
              <Input label="Descripción" value={item.description} onChange={(value) => updateItem(item.id, "description", value)} />
              <Input label="Cantidad" type="number" value={item.quantity} onChange={(value) => updateItem(item.id, "quantity", value)} />
              <Input label="Precio unitario" type="number" value={item.unitPrice} onChange={(value) => updateItem(item.id, "unitPrice", value)} />
              <div><p className="label">Subtotal</p><p className="rounded-xl border border-white/10 bg-white/[.025] px-3 py-2 font-black text-[#62d6ff]">{PEN.format(toNumber(item.quantity) * toNumber(item.unitPrice))}</p></div>
              <button type="button" className="btn-secondary self-end" onClick={() => removeItem(item.id)} aria-label="Eliminar fila"><Trash2 size={17} /></button>
            </div>)}
          </div>
          <button type="button" className="btn-secondary mt-4" onClick={addItem}><Plus size={17} /> Agregar producto/servicio</button>
        </Card>

        <Card title="Totales">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080e19] px-4 py-3 text-sm font-bold text-[#c9d5e8]"><input type="checkbox" checked={includeIgv} onChange={(event) => setIncludeIgv(event.target.checked)} className="size-4 accent-[#16a8ff]" /> IGV opcional 18%</label>
            <Input label="Descuento opcional" type="number" value={discount} onChange={setDiscount} />
          </div>
          {error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200">{error}</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={generatePdf} disabled={isGenerating}><FileDown size={17} /> {isGenerating ? "Generando..." : "Generar PDF"}</button>
            <button type="button" className="btn-secondary" onClick={clear}><RotateCcw size={17} /> Limpiar formulario</button>
          </div>
        </Card>
      </form>

      <aside className="card h-fit p-6 md:p-8">
        <h2 className="text-xl font-black">Vista previa</h2>
        <div className="mt-5 rounded-2xl bg-white p-6 text-[#121c2c] shadow-2xl">
          <div className="flex justify-between gap-4 border-b border-slate-200 pb-4"><div><h3 className="text-xl font-black">{businessName || "Nombre del negocio"}</h3><p className="text-sm">RUC/DNI: {businessDocument || "-"}</p><p className="text-sm">{businessPhone || "-"}</p></div><div className="text-right"><p className="font-black">COTIZACIÓN</p><p className="text-sm">{number}</p><p className="text-sm">{date}</p></div></div>
          <div className="mt-4 text-sm"><p className="font-black">Cliente</p><p>{clientName || "Nombre del cliente"}</p><p>{clientDocument || "-"}</p></div>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200"><table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">Descripción</th><th className="p-2 text-right">Cant.</th><th className="p-2 text-right">Subtotal</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="p-2">{item.description || "Producto/servicio"}</td><td className="p-2 text-right">{item.quantity}</td><td className="p-2 text-right">{PEN.format(toNumber(item.quantity) * toNumber(item.unitPrice))}</td></tr>)}</tbody></table></div>
          <div className="mt-5 grid gap-1 text-sm"><PreviewTotal label="Subtotal" value={totals.subtotal} /><PreviewTotal label="Descuento" value={totals.discountAmount} /><PreviewTotal label="IGV" value={totals.igv} /><div className="mt-2 flex justify-between text-lg font-black"><span>Total</span><span>{PEN.format(totals.total)}</span></div></div>
          {observations && <p className="mt-5 text-xs text-slate-600">{observations}</p>}
        </div>
      </aside>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="card p-6 md:p-8"><h2 className="mb-5 text-xl font-black">{title}</h2>{children}</section>;
}

function Input({ label, value, onChange, placeholder = "", type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return <div><label className="label">{label}{required ? " *" : ""}</label><input className="input" type={type} min={type === "number" ? "0" : undefined} step={type === "number" ? "0.01" : undefined} inputMode={type === "number" ? "decimal" : undefined} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}

function PreviewTotal({ label, value }: { label: string; value: number }) {
  return <div className="flex justify-between"><span>{label}</span><span>{PEN.format(value)}</span></div>;
}

function toNumber(value: string) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatNumber(value: number) {
  return value.toLocaleString("es-PE", { maximumFractionDigits: 2 });
}

function sectionTitle(pdf: PdfDoc, title: string, x: number, y: number) {
  pdf.setDrawColor(22, 168, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(title, x, y);
  pdf.line(x, y + 2, 196, y + 2);
}

function tableHeader(pdf: PdfDoc, y: number) {
  pdf.setFillColor(236, 242, 248);
  pdf.setTextColor(18, 28, 44);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.text("#", 16, y);
  pdf.text("Descripción", 26, y);
  pdf.text("Cant.", 126, y, { align: "right" });
  pdf.text("P. Unit.", 158, y, { align: "right" });
  pdf.text("Subtotal", 195, y, { align: "right" });
  pdf.line(14, y + 2, 196, y + 2);
}

function totalLine(pdf: PdfDoc, label: string, value: number, y: number) {
  pdf.setTextColor(18, 28, 44);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(label, 142, y);
  pdf.text(PEN.format(value), 195, y, { align: "right" });
}

async function loadJsPdf() {
  if (window.jspdf?.jsPDF) return window.jspdf.jsPDF;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("jsPDF no cargó"));
    document.head.appendChild(script);
  });
  if (!window.jspdf?.jsPDF) throw new Error("jsPDF no disponible");
  return window.jspdf.jsPDF;
}

async function imageToDataUrl(url: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}
