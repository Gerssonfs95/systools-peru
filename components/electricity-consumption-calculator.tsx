"use client";

import { Calculator, Info, Lightbulb, RotateCcw, Zap } from "lucide-react";
import { useState } from "react";

const examples = [
  { name: "PC Gamer", watts: 400 },
  { name: "Refrigeradora", watts: 150 },
  { name: "TV", watts: 100 },
  { name: "Aire acondicionado", watts: 1200 },
];

type Results = {
  dailyConsumption: number;
  monthlyConsumption: number;
  monthlyCost: number;
  annualCost: number;
};

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function ElectricityConsumptionCalculator() {
  const [power, setPower] = useState("");
  const [hours, setHours] = useState("");
  const [days, setDays] = useState("");
  const [price, setPrice] = useState("0.75");
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState("");

  function calculate(event: React.FormEvent) {
    event.preventDefault();

    if (!power || !hours || !days || !price) {
      setError("Completa todos los campos para calcular el consumo.");
      setResults(null);
      return;
    }

    const numericPower = Number(power);
    const numericHours = Number(hours);
    const numericDays = Number(days);
    const numericPrice = Number(price);

    if (![numericPower, numericHours, numericDays, numericPrice].every(Number.isFinite) || numericPower <= 0 || numericHours <= 0 || numericDays < 0 || numericPrice < 0) {
      setError("La potencia y las horas deben ser mayores a cero. Los días y el precio no pueden ser negativos.");
      setResults(null);
      return;
    }

    const dailyConsumption = numericPower * numericHours / 1000;
    const monthlyConsumption = dailyConsumption * numericDays;
    const monthlyCost = monthlyConsumption * numericPrice;

    setResults({
      dailyConsumption,
      monthlyConsumption,
      monthlyCost,
      annualCost: monthlyCost * 12,
    });
    setError("");
  }

  function clear() {
    setPower("");
    setHours("");
    setDays("");
    setPrice("0.75");
    setResults(null);
    setError("");
  }

  function selectExample(watts: number) {
    setPower(String(watts));
    setResults(null);
    setError("");
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
        <form onSubmit={calculate} className="card p-6 md:p-8">
          <div className="mb-7 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Zap /></span>
            <div><h2 className="text-xl font-black">Datos de consumo</h2><p className="mt-1 text-sm text-[#8e9cb1]">Ingresa el uso estimado del equipo.</p></div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input id="equipment-power" label="Potencia del equipo (Watts)" placeholder="Ejemplo: 400" value={power} onChange={setPower} />
            <Input id="daily-hours" label="Horas de uso por día" placeholder="Ejemplo: 6" value={hours} onChange={setHours} />
            <Input id="monthly-days" label="Días de uso al mes" placeholder="Ejemplo: 30" value={days} onChange={setDays} />
            <Input id="kwh-price" label="Precio por kWh" placeholder="Ejemplo: 0.75" value={price} onChange={setPrice} />
          </div>

          <div className="mt-6">
            <p className="label mb-3">Ejemplos rápidos</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {examples.map((example) => <button key={example.name} type="button" onClick={() => selectExample(example.watts)} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#080e19] px-4 py-3 text-left text-sm font-bold text-[#c9d5e8] transition hover:border-[#16a8ff]/50 hover:bg-[#16a8ff]/5"><span>{example.name}</span><span className="text-[#62d6ff]">{example.watts}W</span></button>)}
            </div>
          </div>

          {error && <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200">{error}</p>}
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary"><Calculator size={17} /> Calcular</button>
            <button type="button" className="btn-secondary" onClick={clear}><RotateCcw size={17} /> Limpiar</button>
          </div>
        </form>

        <section className="card p-6 md:p-8" aria-live="polite">
          <div className="mb-7 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Lightbulb /></span>
            <div><h2 className="text-xl font-black">Resultados estimados</h2><p className="mt-1 text-sm text-[#8e9cb1]">Consumo y costo aproximado.</p></div>
          </div>
          <div className="grid gap-4">
            <Result label="Consumo diario" value={results ? `${results.dailyConsumption.toFixed(2)} kWh` : "0.00 kWh"} />
            <Result label="Consumo mensual" value={results ? `${results.monthlyConsumption.toFixed(2)} kWh` : "0.00 kWh"} />
            <Result label="Costo mensual estimado" value={results ? currency.format(results.monthlyCost) : "S/ 0.00"} highlight />
            <Result label="Costo anual estimado" value={results ? currency.format(results.annualCost) : "S/ 0.00"} />
          </div>
        </section>
      </div>

      <section className="card mt-6 p-6 md:p-8">
        <div className="flex items-start gap-4"><span className="mt-1 grid size-10 shrink-0 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Info size={20} /></span><div><h2 className="text-lg font-black">Ten en cuenta</h2><p className="mt-3 leading-7 text-[#98a7bc]">Los resultados son aproximados y pueden variar según el consumo real del equipo.</p></div></div>
      </section>
    </>
  );
}

function Input({ id, label, placeholder, value, onChange }: { id: string; label: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return <div><label className="label" htmlFor={id}>{label}</label><input id={id} className="input" type="number" min="0" step="0.01" inputMode="decimal" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}

function Result({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div className="rounded-2xl border border-white/10 bg-[#080e19] p-5"><p className="text-sm font-bold text-[#8e9cb1]">{label}</p><p className={`mt-2 break-words text-2xl font-black ${highlight ? "text-[#62d6ff]" : "text-white"}`}>{value}</p></div>;
}
