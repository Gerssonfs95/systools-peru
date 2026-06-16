"use client";

import { Clipboard, FileDown, Plus, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type Template = "classic" | "tech";
type Experience = { id: number; role: string; company: string; start: string; end: string; description: string };
type Education = { id: number; degree: string; institution: string; start: string; end: string };
type Language = { id: number; name: string; level: string };
type PdfConstructor = new (options?: { orientation?: string; unit?: string; format?: string }) => PdfDoc;
type PdfDoc = {
  addImage: (imageData: string, format: string, x: number, y: number, width: number, height: number) => void;
  addPage: () => void;
  circle: (x: number, y: number, radius: number, style?: string) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  rect: (x: number, y: number, width: number, height: number, style?: string) => void;
  save: (filename: string) => void;
  setDrawColor: (r: number, g: number, b: number) => void;
  setFillColor: (r: number, g: number, b: number) => void;
  setFont: (fontName: string, fontStyle?: string) => void;
  setFontSize: (fontSize: number) => void;
  setTextColor: (r: number, g: number, b: number) => void;
  splitTextToSize: (text: string, maxWidth: number) => string[];
  text: (text: string | string[], x: number, y: number, options?: { align?: string }) => void;
};

const blankExperience = (): Experience => ({ id: Date.now(), role: "", company: "", start: "", end: "", description: "" });
const blankEducation = (): Education => ({ id: Date.now(), degree: "", institution: "", start: "", end: "" });
const blankLanguage = (): Language => ({ id: Date.now(), name: "", level: "" });

export function CvPdfGenerator() {
  const [template, setTemplate] = useState<Template>("classic");
  const [fullName, setFullName] = useState("");
  const [profession, setProfession] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([blankEducation()]);
  const [languages, setLanguages] = useState<Language[]>([blankLanguage()]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const skillList = useMemo(() => skills.split(",").map((item) => item.trim()).filter(Boolean), [skills]);

  function validate() {
    if (!fullName.trim()) return "El nombre completo es obligatorio.";
    if (!phone.trim() && !email.trim()) return "Ingresa al menos teléfono o correo.";
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
      pdf.save(`${slugify(fullName) || "cv"}.pdf`);
    } catch {
      setError("No se pudo generar el PDF. Revisa tu conexión e inténtalo nuevamente.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function drawPdf(pdf: PdfDoc) {
    const isTech = template === "tech";
    const accent = isTech ? [22, 168, 255] : [35, 51, 75];
    let y = 20;

    if (isTech) {
      pdf.setFillColor(5, 12, 24);
      pdf.rect(0, 0, 210, 42, "F");
      pdf.setTextColor(245, 248, 255);
    } else {
      pdf.setTextColor(18, 28, 44);
    }

    if (photoUrl.trim()) {
      const photo = await imageToDataUrl(photoUrl.trim());
      if (photo) pdf.addImage(photo, "JPEG", 166, 12, 26, 26);
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text(fullName || "Nombre completo", 16, y);
    y += 8;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(profession || "Profesión o cargo objetivo", 16, y);
    y += 8;
    pdf.setFontSize(9);
    pdf.text([phone, email, city, linkedin, portfolio].filter(Boolean).join(" | "), 16, y);

    y = isTech ? 54 : 48;
    y = drawSection(pdf, "Perfil profesional", summary || "Resumen profesional no especificado.", 16, y, accent);
    if (experiences.length > 0) y = drawExperience(pdf, experiences, y, accent);
    y = drawEducation(pdf, education.filter((item) => item.degree || item.institution), y, accent);
    y = drawList(pdf, "Habilidades", skillList, y, accent);
    y = drawLanguages(pdf, languages.filter((item) => item.name || item.level), y, accent);
  }

  async function copySummary() {
    if (!summary.trim()) {
      setError("Escribe o carga un resumen profesional antes de copiarlo.");
      return;
    }
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setError("");
    window.setTimeout(() => setCopied(false), 1800);
  }

  function loadExample() {
    setTemplate("tech");
    setFullName("María Fernanda Quispe");
    setProfession("Asistente Administrativa");
    setPhone("+51 999 888 777");
    setEmail("maria.quispe@email.com");
    setCity("Lima, Perú");
    setLinkedin("linkedin.com/in/maria-quispe");
    setPortfolio("mariaquispe.com");
    setPhotoUrl("");
    setSummary("Profesional organizada y orientada a resultados, con experiencia en atención al cliente, gestión documental y apoyo administrativo. Destaca por su comunicación clara, manejo de herramientas digitales y capacidad para ordenar procesos.");
    setExperiences([{ id: 1, role: "Asistente Administrativa", company: "Servicios Andinos SAC", start: "2023", end: "Actualidad", description: "Gestión de documentos, coordinación de agendas, atención a clientes y elaboración de reportes mensuales." }]);
    setEducation([{ id: 2, degree: "Técnico en Administración", institution: "Instituto Superior Tecnológico", start: "2020", end: "2022" }]);
    setSkills("Excel, Atención al cliente, Gestión documental, Organización, Comunicación efectiva");
    setLanguages([{ id: 3, name: "Español", level: "Nativo" }, { id: 4, name: "Inglés", level: "Intermedio" }]);
    setError("");
  }

  function clear() {
    setTemplate("classic"); setFullName(""); setProfession(""); setPhone(""); setEmail(""); setCity("");
    setLinkedin(""); setPortfolio(""); setPhotoUrl(""); setSummary(""); setSkills("");
    setExperiences([]); setEducation([blankEducation()]); setLanguages([blankLanguage()]);
    setError(""); setCopied(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
      <form className="grid gap-6" onSubmit={(event) => event.preventDefault()}>
        <Card title="Plantilla">
          <div className="grid gap-3 sm:grid-cols-2">
            <TemplateOption label="Clásico profesional" active={template === "classic"} onClick={() => setTemplate("classic")} />
            <TemplateOption label="Moderno tecnológico" active={template === "tech"} onClick={() => setTemplate("tech")} />
          </div>
        </Card>

        <Card title="Datos personales">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nombre completo" value={fullName} onChange={setFullName} required />
            <Input label="Profesión o cargo objetivo" value={profession} onChange={setProfession} />
            <Input label="Teléfono" value={phone} onChange={setPhone} />
            <Input label="Correo" type="email" value={email} onChange={setEmail} />
            <Input label="Ciudad / País" value={city} onChange={setCity} />
            <Input label="LinkedIn opcional" value={linkedin} onChange={setLinkedin} />
            <Input label="Portafolio opcional" value={portfolio} onChange={setPortfolio} />
            <Input label="Foto URL opcional" value={photoUrl} onChange={setPhotoUrl} placeholder="https://..." />
          </div>
        </Card>

        <Card title="Perfil profesional">
          <textarea className="input min-h-32" value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Resume tu experiencia, fortalezas y objetivo profesional." />
          <button type="button" className="btn-secondary mt-4" onClick={copySummary}><Clipboard size={17} /> {copied ? "Resumen copiado" : "Copiar resumen profesional"}</button>
        </Card>

        <DynamicSection title="Experiencia laboral" action="Agregar experiencia" onAdd={() => setExperiences((items) => [...items, blankExperience()])}>
          {experiences.length === 0 && <p className="text-sm leading-6 text-[#8e9cb1]">Puedes generar tu CV sin experiencia laboral.</p>}
          {experiences.map((item) => <div key={item.id} className="grid gap-3 rounded-2xl border border-white/10 bg-[#080e19] p-4">
            <div className="grid gap-3 sm:grid-cols-2"><Input label="Cargo" value={item.role} onChange={(value) => updateExperience(item.id, "role", value)} /><Input label="Empresa" value={item.company} onChange={(value) => updateExperience(item.id, "company", value)} /><Input label="Fecha inicio" value={item.start} onChange={(value) => updateExperience(item.id, "start", value)} /><Input label="Fecha fin" value={item.end} onChange={(value) => updateExperience(item.id, "end", value)} /></div>
            <textarea className="input min-h-24" value={item.description} onChange={(event) => updateExperience(item.id, "description", event.target.value)} placeholder="Descripción de funciones" />
            <button type="button" className="btn-secondary w-fit" onClick={() => setExperiences((items) => items.filter((current) => current.id !== item.id))}><Trash2 size={17} /> Eliminar experiencia</button>
          </div>)}
        </DynamicSection>

        <DynamicSection title="Educación" action="Agregar educación" onAdd={() => setEducation((items) => [...items, blankEducation()])}>
          {education.map((item) => <div key={item.id} className="grid gap-3 rounded-2xl border border-white/10 bg-[#080e19] p-4 sm:grid-cols-2">
            <Input label="Carrera o grado" value={item.degree} onChange={(value) => updateEducation(item.id, "degree", value)} />
            <Input label="Institución" value={item.institution} onChange={(value) => updateEducation(item.id, "institution", value)} />
            <Input label="Fecha inicio" value={item.start} onChange={(value) => updateEducation(item.id, "start", value)} />
            <Input label="Fecha fin" value={item.end} onChange={(value) => updateEducation(item.id, "end", value)} />
            <button type="button" className="btn-secondary w-fit" onClick={() => setEducation((items) => items.length === 1 ? items : items.filter((current) => current.id !== item.id))}><Trash2 size={17} /> Eliminar educación</button>
          </div>)}
        </DynamicSection>

        <Card title="Habilidades">
          <Input label="Lista de habilidades separadas por coma" value={skills} onChange={setSkills} placeholder="Excel, Ventas, Soporte técnico" />
        </Card>

        <DynamicSection title="Idiomas" action="Agregar idioma" onAdd={() => setLanguages((items) => [...items, blankLanguage()])}>
          {languages.map((item) => <div key={item.id} className="grid gap-3 rounded-2xl border border-white/10 bg-[#080e19] p-4 sm:grid-cols-[1fr_1fr_auto]">
            <Input label="Idioma" value={item.name} onChange={(value) => updateLanguage(item.id, "name", value)} />
            <Input label="Nivel" value={item.level} onChange={(value) => updateLanguage(item.id, "level", value)} />
            <button type="button" className="btn-secondary self-end" onClick={() => setLanguages((items) => items.length === 1 ? items : items.filter((current) => current.id !== item.id))}><Trash2 size={17} /> Eliminar idioma</button>
          </div>)}
        </DynamicSection>

        <Card title="Acciones">
          {error && <p className="mb-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={generatePdf} disabled={isGenerating}><FileDown size={17} /> {isGenerating ? "Generando..." : "Generar PDF"}</button>
            <button type="button" className="btn-secondary" onClick={loadExample}><Sparkles size={17} /> Cargar ejemplo</button>
            <button type="button" className="btn-secondary" onClick={clear}><RotateCcw size={17} /> Limpiar formulario</button>
          </div>
        </Card>
      </form>

      <aside className="card h-fit p-6 md:p-8">
        <h2 className="text-xl font-black">Vista previa del CV</h2>
        <div className={`mt-5 overflow-hidden rounded-2xl bg-white text-[#121c2c] shadow-2xl ${template === "tech" ? "border-t-8 border-[#16a8ff]" : ""}`}>
          <div className={`${template === "tech" ? "bg-[#07111f] text-white" : "border-b border-slate-200"} p-6`}>
            <h3 className="text-2xl font-black">{fullName || "Nombre completo"}</h3>
            <p className={template === "tech" ? "text-[#62d6ff]" : "text-slate-600"}>{profession || "Profesión o cargo objetivo"}</p>
            <p className="mt-3 text-xs">{[phone, email, city].filter(Boolean).join(" | ") || "Teléfono | Correo | Ciudad"}</p>
          </div>
          <div className="grid gap-5 p-6 text-sm">
            <PreviewBlock title="Perfil" text={summary || "Resumen profesional"} />
            <PreviewBlock title="Experiencia" text={experiences[0] ? `${experiences[0].role || "Cargo"} - ${experiences[0].company || "Empresa"}` : "Sin experiencia laboral registrada"} />
            <PreviewBlock title="Educación" text={education[0] ? `${education[0].degree || "Carrera o grado"} - ${education[0].institution || "Institución"}` : "Educación"} />
            <PreviewBlock title="Habilidades" text={skillList.length ? skillList.join(", ") : "Habilidades separadas por coma"} />
            <PreviewBlock title="Idiomas" text={languages.filter((item) => item.name || item.level).map((item) => `${item.name} ${item.level}`).join(", ") || "Idiomas"} />
          </div>
        </div>
      </aside>
    </div>
  );

  function updateExperience(id: number, key: keyof Omit<Experience, "id">, value: string) {
    setExperiences((items) => items.map((item) => item.id === id ? { ...item, [key]: value } : item));
  }
  function updateEducation(id: number, key: keyof Omit<Education, "id">, value: string) {
    setEducation((items) => items.map((item) => item.id === id ? { ...item, [key]: value } : item));
  }
  function updateLanguage(id: number, key: keyof Omit<Language, "id">, value: string) {
    setLanguages((items) => items.map((item) => item.id === id ? { ...item, [key]: value } : item));
  }
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="card p-6 md:p-8"><h2 className="mb-5 text-xl font-black">{title}</h2>{children}</section>;
}

function DynamicSection({ title, action, onAdd, children }: { title: string; action: string; onAdd: () => void; children: React.ReactNode }) {
  return <Card title={title}><div className="grid gap-3">{children}</div><button type="button" className="btn-secondary mt-4" onClick={onAdd}><Plus size={17} /> {action}</button></Card>;
}

function Input({ label, value, onChange, placeholder = "", type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return <div><label className="label">{label}{required ? " *" : ""}</label><input className="input" type={type} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}

function TemplateOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-xl border px-4 py-3 text-left text-sm font-black transition ${active ? "border-[#16a8ff]/60 bg-[#16a8ff]/10 text-[#62d6ff]" : "border-white/10 bg-[#080e19] text-[#c9d5e8] hover:border-[#16a8ff]/40"}`}>{label}</button>;
}

function PreviewBlock({ title, text }: { title: string; text: string }) {
  return <div><p className="font-black uppercase tracking-wider text-slate-500">{title}</p><p className="mt-1 leading-6">{text}</p></div>;
}

function drawSection(pdf: PdfDoc, title: string, content: string, x: number, y: number, accent: number[]) {
  y = ensureSpace(pdf, y, 32);
  sectionTitle(pdf, title, x, y, accent);
  y += 7;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(35, 45, 60);
  const lines = pdf.splitTextToSize(content, 178);
  pdf.text(lines, x, y);
  return y + lines.length * 5 + 6;
}

function drawExperience(pdf: PdfDoc, items: Experience[], y: number, accent: number[]) {
  y = ensureSpace(pdf, y, 24);
  sectionTitle(pdf, "Experiencia laboral", 16, y, accent);
  y += 8;
  items.forEach((item) => {
    if (!item.role && !item.company && !item.description) return;
    y = ensureSpace(pdf, y, 28);
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(11); pdf.setTextColor(18, 28, 44);
    pdf.text(`${item.role || "Cargo"} - ${item.company || "Empresa"}`, 16, y);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9);
    pdf.text(`${item.start || "-"} / ${item.end || "-"}`, 196, y, { align: "right" });
    y += 5;
    const lines = pdf.splitTextToSize(item.description || "-", 178);
    pdf.text(lines, 16, y);
    y += lines.length * 4.5 + 5;
  });
  return y;
}

function drawEducation(pdf: PdfDoc, items: Education[], y: number, accent: number[]) {
  if (items.length === 0) return y;
  y = ensureSpace(pdf, y, 22);
  sectionTitle(pdf, "Educación", 16, y, accent);
  y += 8;
  items.forEach((item) => {
    y = ensureSpace(pdf, y, 14);
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); pdf.setTextColor(18, 28, 44);
    pdf.text(item.degree || "Carrera o grado", 16, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${item.institution || "Institución"} | ${item.start || "-"} / ${item.end || "-"}`, 16, y + 5);
    y += 13;
  });
  return y;
}

function drawList(pdf: PdfDoc, title: string, items: string[], y: number, accent: number[]) {
  if (items.length === 0) return y;
  y = ensureSpace(pdf, y, 22);
  sectionTitle(pdf, title, 16, y, accent);
  y += 8;
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(10); pdf.setTextColor(35, 45, 60);
  const lines = pdf.splitTextToSize(items.join(" • "), 178);
  pdf.text(lines, 16, y);
  return y + lines.length * 5 + 6;
}

function drawLanguages(pdf: PdfDoc, items: Language[], y: number, accent: number[]) {
  if (items.length === 0) return y;
  return drawList(pdf, "Idiomas", items.map((item) => `${item.name || "Idioma"}: ${item.level || "Nivel"}`), y, accent);
}

function sectionTitle(pdf: PdfDoc, title: string, x: number, y: number, accent: number[]) {
  pdf.setTextColor(accent[0], accent[1], accent[2]);
  pdf.setDrawColor(accent[0], accent[1], accent[2]);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text(title, x, y);
  pdf.line(x, y + 2, 196, y + 2);
}

function ensureSpace(pdf: PdfDoc, y: number, needed: number) {
  if (y + needed <= 280) return y;
  pdf.addPage();
  return 18;
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function loadJsPdf(): Promise<PdfConstructor> {
  const jspdfWindow = window as Window & { jspdf?: { jsPDF: PdfConstructor } };
  if (jspdfWindow.jspdf?.jsPDF) return jspdfWindow.jspdf.jsPDF;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("jsPDF no cargó"));
    document.head.appendChild(script);
  });
  if (!jspdfWindow.jspdf?.jsPDF) throw new Error("jsPDF no disponible");
  return jspdfWindow.jspdf.jsPDF;
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
