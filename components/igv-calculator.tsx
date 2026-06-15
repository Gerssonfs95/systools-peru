"use client";

import { Calculator, Info, Percent, RotateCcw } from "lucide-react";
import { useState } from "react";

const IGV_RATE = 0.18;

type CalculationType = "add" | "remove";
type Results = { subtotal: number; igv: number; total: number };

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function IgvCalculator() {
  const [amount, setAmount] = useState("");
  const [calculationType, setCalculationType] = useState<CalculationType>("add");
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState("");

  function calculate(event: React.FormEvent) {
    event.preventDefault();

    if (!amount) {
      setError("Ingresa un monto para realizar el cálculo.");
      setResults(null);
      return;
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("El monto debe ser un número mayor a cero.");
      setResults(null);
      return;
    }

    if (calculationType === "add") {
      const igv = numericAmount * IGV_RATE;
      setResults({ subtotal: numericAmount, igv, total: numericAmount + igv });
    } else {
      const subtotal = numericAmount / (1 + IGV_RATE);
      setResults({ subtotal, igv: numericAmount - subtotal, total: numericAmount });
    }
    setError("");
  }

  function clear() {
    setAmount("");
    setCalculationType("add");
    setResults(null);
    setError("");
  }

  function changeType(type: CalculationType) {
    setCalculationType(type);
    setResults(null);
    setError("");
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
        <form onSubmit={calculate} className="card p-6 md:p-8">
          <div className="mb-7 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Percent /></span>
            <div><h2 className="text-xl font-black">Datos del cálculo</h2><p className="mt-1 text-sm text-[#8e9cb1]">Tasa de IGV aplicada: 18%.</p></div>
          </div>

          <div>
            <label className="label" htmlFor="igv-amount">Monto</label>
            <input id="igv-amount" className="input" type="number" min="0" step="0.01" inputMode="decimal" placeholder="Ejemplo: 100.00" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </div>

          <fieldset className="mt-6">
            <legend className="label mb-3">Tipo de cálculo</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <TypeOption label="Agregar IGV al precio" description="El monto ingresado es el subtotal." checked={calculationType === "add"} onChange={() => changeType("add")} />
              <TypeOption label="Quitar IGV de un precio final" description="El monto ingresado ya incluye IGV." checked={calculationType === "remove"} onChange={() => changeType("remove")} />
            </div>
          </fieldset>

          {error && <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200">{error}</p>}
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary"><Calculator size={17} /> Calcular</button>
            <button type="button" className="btn-secondary" onClick={clear}><RotateCcw size={17} /> Limpiar</button>
          </div>
        </form>

        <section className="card p-6 md:p-8" aria-live="polite">
          <div className="mb-7 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Calculator /></span>
            <div><h2 className="text-xl font-black">Resultados</h2><p className="mt-1 text-sm text-[#8e9cb1]">{calculationType === "add" ? "IGV agregado al subtotal." : "IGV separado del precio final."}</p></div>
          </div>
          <div className="grid gap-4">
            {calculationType === "add" ? (
              <>
                <Result label="Subtotal" value={results ? currency.format(results.subtotal) : "S/ 0.00"} />
                <Result label="IGV" value={results ? currency.format(results.igv) : "S/ 0.00"} />
                <Result label="Total con IGV" value={results ? currency.format(results.total) : "S/ 0.00"} highlight />
              </>
            ) : (
              <>
                <Result label="Total ingresado" value={results ? currency.format(results.total) : "S/ 0.00"} />
                <Result label="Subtotal sin IGV" value={results ? currency.format(results.subtotal) : "S/ 0.00"} highlight />
                <Result label="IGV incluido" value={results ? currency.format(results.igv) : "S/ 0.00"} />
              </>
            )}
          </div>
        </section>
      </div>

      <section className="card mt-6 p-6 md:p-8">
        <div className="flex items-start gap-4"><span className="mt-1 grid size-10 shrink-0 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Info size={20} /></span><div><h2 className="text-lg font-black">¿Qué es el IGV?</h2><p className="mt-3 leading-7 text-[#98a7bc]">El Impuesto General a las Ventas (IGV) es un impuesto aplicado al consumo en Perú. La tasa general utilizada por esta calculadora es 18%, permitiéndote agregarla a un precio base o identificar cuánto IGV está incluido en un precio final.</p></div></div>
      </section>
    </>
  );
}

function TypeOption({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: () => void }) {
  return <label className={`cursor-pointer rounded-xl border p-4 transition ${checked ? "border-[#16a8ff]/60 bg-[#16a8ff]/10" : "border-white/10 bg-[#080e19] hover:border-[#16a8ff]/40"}`}><span className="flex items-center gap-3"><input type="radio" name="calculation-type" checked={checked} onChange={onChange} className="size-4 accent-[#16a8ff]" /><span className="text-sm font-black text-white">{label}</span></span><span className="mt-2 block pl-7 text-xs leading-5 text-[#8e9cb1]">{description}</span></label>;
}

function Result({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div className="rounded-2xl border border-white/10 bg-[#080e19] p-5"><p className="text-sm font-bold text-[#8e9cb1]">{label}</p><p className={`mt-2 break-words text-2xl font-black sm:text-3xl ${highlight ? "text-[#62d6ff]" : "text-white"}`}>{value}</p></div>;
}
