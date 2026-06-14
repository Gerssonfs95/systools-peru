"use client";

import { Calculator, RotateCcw, TrendingUp } from "lucide-react";
import { useState } from "react";

type Results = { profit: number; margin: number; profitability: number };
const currency = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2 });

export function ProfitMarginCalculator() {
  const [cost, setCost] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState("");

  function calculate(event: React.FormEvent) {
    event.preventDefault();
    const numericCost = Number(cost);
    const numericSalePrice = Number(salePrice);

    if (!Number.isFinite(numericCost) || !Number.isFinite(numericSalePrice) || numericCost <= 0 || numericSalePrice <= 0) {
      setError("Ingresa un costo y un precio de venta mayores que cero.");
      setResults(null);
      return;
    }

    const profit = numericSalePrice - numericCost;
    setError("");
    setResults({
      profit,
      margin: (profit / numericSalePrice) * 100,
      profitability: (profit / numericCost) * 100,
    });
  }

  function clear() {
    setCost("");
    setSalePrice("");
    setResults(null);
    setError("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
      <form onSubmit={calculate} className="card p-6 md:p-8">
        <div className="mb-7 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Calculator /></span>
          <div><h2 className="text-xl font-black">Datos del producto</h2><p className="mt-1 text-sm text-[#8e9cb1]">Ingresa los valores en soles.</p></div>
        </div>
        <div><label className="label" htmlFor="cost">Costo del producto</label><input id="cost" className="input" type="number" min="0" step="0.01" inputMode="decimal" placeholder="Ejemplo: 80.00" value={cost} onChange={(event) => setCost(event.target.value)} /></div>
        <div className="mt-5"><label className="label" htmlFor="sale-price">Precio de venta</label><input id="sale-price" className="input" type="number" min="0" step="0.01" inputMode="decimal" placeholder="Ejemplo: 120.00" value={salePrice} onChange={(event) => setSalePrice(event.target.value)} /></div>
        {error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-200">{error}</p>}
        <div className="mt-7 flex flex-wrap gap-3"><button type="submit" className="btn-primary"><Calculator size={17} /> Calcular</button><button type="button" className="btn-secondary" onClick={clear}><RotateCcw size={17} /> Limpiar</button></div>
      </form>
      <section className="card p-6 md:p-8" aria-live="polite">
        <div className="mb-7 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><TrendingUp /></span><div><h2 className="text-xl font-black">Resultados</h2><p className="mt-1 text-sm text-[#8e9cb1]">Resumen de tu operación.</p></div></div>
        <div className="grid gap-4"><Result label="Ganancia" value={results ? currency.format(results.profit) : "S/ 0.00"} highlight /><Result label="Margen" value={results ? `${results.margin.toFixed(2)}%` : "0.00%"} /><Result label="Rentabilidad" value={results ? `${results.profitability.toFixed(2)}%` : "0.00%"} /></div>
      </section>
    </div>
  );
}

function Result({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div className="rounded-2xl border border-white/10 bg-[#080e19] p-5"><p className="text-sm font-bold text-[#8e9cb1]">{label}</p><p className={`mt-2 text-3xl font-black ${highlight ? "text-[#62d6ff]" : "text-white"}`}>{value}</p></div>;
}
