"use client";

import { Calculator, Info, MonitorCog, RotateCcw, Zap } from "lucide-react";
import { useState } from "react";

const processors = [
  ["Ryzen 3 3200G", 65], ["Ryzen 5 5600G", 65], ["Ryzen 5 5600X", 65],
  ["Intel Core i3", 60], ["Intel Core i5", 90], ["Intel Core i7", 125],
] as const;

const graphicsCards = [
  ["Sin tarjeta gráfica", 0], ["GTX 1650", 75], ["GTX 1660 Super", 125],
  ["RTX 3050", 130], ["RTX 3060", 170], ["RTX 4060", 115], ["RTX 4070", 200],
] as const;

type Results = { estimatedConsumption: number; recommendedPower: string; certification: string };

export function PcPowerSupplyCalculator() {
  const [processor, setProcessor] = useState("65");
  const [graphicsCard, setGraphicsCard] = useState("0");
  const [ssdCount, setSsdCount] = useState("1");
  const [hddCount, setHddCount] = useState("0");
  const [fanCount, setFanCount] = useState("2");
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState("");

  function calculate(event: React.FormEvent) {
    event.preventDefault();
    const quantities = [Number(ssdCount), Number(hddCount), Number(fanCount)];

    if (!ssdCount || !hddCount || !fanCount) {
      setError("Completa todas las cantidades para calcular la fuente recomendada.");
      setResults(null);
      return;
    }
    if (quantities.some((quantity) => !Number.isInteger(quantity) || quantity < 0)) {
      setError("Las cantidades deben ser números enteros iguales o mayores a cero.");
      setResults(null);
      return;
    }

    const baseConsumption = Number(processor) + Number(graphicsCard) + quantities[0] * 5 + quantities[1] * 10 + quantities[2] * 3;
    const estimatedConsumption = Math.ceil(baseConsumption * 1.3);
    setResults({ estimatedConsumption, ...getRecommendation(estimatedConsumption) });
    setError("");
  }

  function clear() {
    setProcessor("65"); setGraphicsCard("0"); setSsdCount("1"); setHddCount("0"); setFanCount("2");
    setResults(null); setError("");
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
        <form onSubmit={calculate} className="card p-6 md:p-8">
          <div className="mb-7 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><MonitorCog /></span><div><h2 className="text-xl font-black">Componentes del PC</h2><p className="mt-1 text-sm text-[#8e9cb1]">Selecciona tu configuración principal.</p></div></div>
          <SelectInput id="processor" label="Procesador" value={processor} onChange={setProcessor} options={processors} />
          <div className="mt-5"><SelectInput id="graphics-card" label="Tarjeta gráfica" value={graphicsCard} onChange={setGraphicsCard} options={graphicsCards} /></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <QuantityInput id="ssd-count" label="Cantidad de SSD" value={ssdCount} onChange={setSsdCount} />
            <QuantityInput id="hdd-count" label="Cantidad de HDD" value={hddCount} onChange={setHddCount} />
            <QuantityInput id="fan-count" label="Ventiladores" value={fanCount} onChange={setFanCount} />
          </div>
          {error && <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200">{error}</p>}
          <div className="mt-7 flex flex-wrap gap-3"><button type="submit" className="btn-primary"><Calculator size={17} /> Calcular</button><button type="button" className="btn-secondary" onClick={clear}><RotateCcw size={17} /> Limpiar</button></div>
        </form>
        <section className="card p-6 md:p-8" aria-live="polite">
          <div className="mb-7 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Zap /></span><div><h2 className="text-xl font-black">Recomendación</h2><p className="mt-1 text-sm text-[#8e9cb1]">Incluye un margen de seguridad del 30%.</p></div></div>
          <div className="grid gap-4"><Result label="Consumo estimado" value={results ? `${results.estimatedConsumption}W` : "0W"} /><Result label="Fuente recomendada" value={results?.recommendedPower ?? "Sin calcular"} highlight /><Result label="Certificación recomendada" value={results?.certification ?? "Sin calcular"} /></div>
        </section>
      </div>
      <section className="card mt-6 p-6 md:p-8">
        <div className="flex items-start gap-4"><span className="mt-1 grid size-10 shrink-0 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Info size={20} /></span><div><h2 className="text-lg font-black">¿Por qué es importante elegir una buena fuente?</h2><p className="mt-3 leading-7 text-[#98a7bc]">Una fuente adecuada entrega energía estable, protege los componentes y permite que el equipo trabaje con seguridad cuando aumenta la carga. El margen adicional ayuda a cubrir picos de consumo y futuras mejoras. La estimación es orientativa; también conviene revisar las recomendaciones del fabricante de la tarjeta gráfica.</p></div></div>
      </section>
    </>
  );
}

function SelectInput({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, number])[] }) {
  return <div><label className="label" htmlFor={id}>{label}</label><select id={id} className="input" value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([name, watts]) => <option key={name} value={watts}>{name}: {watts}W</option>)}</select></div>;
}

function QuantityInput({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return <div><label className="label" htmlFor={id}>{label}</label><input id={id} className="input" type="number" min="0" step="1" inputMode="numeric" value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}

function Result({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div className="rounded-2xl border border-white/10 bg-[#080e19] p-5"><p className="text-sm font-bold text-[#8e9cb1]">{label}</p><p className={`mt-2 break-words text-2xl font-black ${highlight ? "text-[#62d6ff]" : "text-white"}`}>{value}</p></div>;
}

function getRecommendation(consumption: number) {
  if (consumption <= 450) return { recommendedPower: "500W", certification: "80 Plus Bronze" };
  if (consumption <= 550) return { recommendedPower: "600W", certification: "80 Plus Bronze" };
  if (consumption <= 650) return { recommendedPower: "700W", certification: "80 Plus Bronze o Gold" };
  return { recommendedPower: "750W o superior", certification: "80 Plus Gold" };
}
