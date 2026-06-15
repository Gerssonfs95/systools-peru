"use client";

import { Calculator, Info, PanelsTopLeft, RotateCcw } from "lucide-react";
import { useState } from "react";

const SHEET_AREA = 1.22 * 2.44;

type Results = {
  area: number;
  sheets: number;
  studs: number;
  rails: number;
  screws: number;
};

export function DrywallCalculator() {
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [studSpacing, setStudSpacing] = useState("60");
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState("");

  function calculate(event: React.FormEvent) {
    event.preventDefault();

    if (!height || !width || !studSpacing) {
      setError("Completa todos los campos para calcular los materiales.");
      setResults(null);
      return;
    }

    const numericHeight = Number(height);
    const numericWidth = Number(width);
    const numericSpacing = Number(studSpacing);

    if (![numericHeight, numericWidth, numericSpacing].every(Number.isFinite) || numericHeight <= 0 || numericWidth <= 0 || numericSpacing <= 0) {
      setError("El alto, el ancho y la separación deben ser números mayores a cero.");
      setResults(null);
      return;
    }

    const area = numericHeight * numericWidth;
    const sheets = Math.ceil(area / SHEET_AREA);
    const studs = Math.ceil(numericWidth / (numericSpacing / 100) + 1);

    setResults({
      area,
      sheets,
      studs,
      rails: numericWidth * 2,
      screws: sheets * 30,
    });
    setError("");
  }

  function clear() {
    setHeight("");
    setWidth("");
    setStudSpacing("60");
    setResults(null);
    setError("");
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
        <form onSubmit={calculate} className="card p-6 md:p-8">
          <div className="mb-7 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><PanelsTopLeft /></span>
            <div><h2 className="text-xl font-black">Medidas de la pared</h2><p className="mt-1 text-sm text-[#8e9cb1]">Plancha estándar: 1.22 m x 2.44 m.</p></div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <MeasurementInput id="wall-height" label="Alto de la pared en metros" placeholder="Ejemplo: 2.40" value={height} onChange={setHeight} />
            <MeasurementInput id="wall-width" label="Ancho de la pared en metros" placeholder="Ejemplo: 4.00" value={width} onChange={setWidth} />
          </div>
          <div className="mt-5">
            <MeasurementInput id="stud-spacing" label="Separación entre parantes en centímetros" placeholder="Ejemplo: 60" value={studSpacing} onChange={setStudSpacing} />
          </div>

          {error && <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200">{error}</p>}
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary"><Calculator size={17} /> Calcular</button>
            <button type="button" className="btn-secondary" onClick={clear}><RotateCcw size={17} /> Limpiar</button>
          </div>
        </form>

        <section className="card p-6 md:p-8" aria-live="polite">
          <div className="mb-7 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Calculator /></span>
            <div><h2 className="text-xl font-black">Materiales aproximados</h2><p className="mt-1 text-sm text-[#8e9cb1]">Resumen para una cara de la pared.</p></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Result label="Área total" value={results ? `${results.area.toFixed(2)} m²` : "0.00 m²"} highlight />
            <Result label="Planchas aproximadas" value={results ? String(results.sheets) : "0"} />
            <Result label="Parantes aproximados" value={results ? String(results.studs) : "0"} />
            <Result label="Metros lineales de riel" value={results ? `${results.rails.toFixed(2)} m` : "0.00 m"} />
            <div className="sm:col-span-2"><Result label="Tornillos aproximados" value={results ? String(results.screws) : "0"} /></div>
          </div>
        </section>
      </div>

      <section className="card mt-6 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Info size={20} /></span>
          <div><h2 className="text-lg font-black">Cálculo referencial</h2><p className="mt-3 leading-7 text-[#98a7bc]">Esta estimación sirve como referencia inicial y puede variar según el diseño, la cantidad de caras a revestir, puertas, ventanas, refuerzos y desperdicio de material. Para una compra final, considera revisar el plano y consultar con un especialista.</p></div>
        </div>
      </section>
    </>
  );
}

function MeasurementInput({ id, label, placeholder, value, onChange }: { id: string; label: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return <div><label className="label" htmlFor={id}>{label}</label><input id={id} className="input" type="number" min="0" step="0.01" inputMode="decimal" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}

function Result({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div className="rounded-2xl border border-white/10 bg-[#080e19] p-5"><p className="text-sm font-bold text-[#8e9cb1]">{label}</p><p className={`mt-2 break-words text-2xl font-black ${highlight ? "text-[#62d6ff]" : "text-white"}`}>{value}</p></div>;
}
