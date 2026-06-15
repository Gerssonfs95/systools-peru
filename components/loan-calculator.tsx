"use client";

import { Calculator, CircleDollarSign, Info, RotateCcw } from "lucide-react";
import { useState } from "react";

type Results = { monthlyPayment: number; totalPayment: number; totalInterest: number };

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function LoanCalculator() {
  const [amount, setAmount] = useState("");
  const [monthlyInterest, setMonthlyInterest] = useState("");
  const [months, setMonths] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState("");

  function calculate(event: React.FormEvent) {
    event.preventDefault();

    if (!amount || !monthlyInterest || !months) {
      setError("Completa todos los campos para calcular la cuota.");
      setResults(null);
      return;
    }

    const numericAmount = Number(amount);
    const numericInterest = Number(monthlyInterest);
    const numericMonths = Number(months);

    if (!Number.isFinite(numericAmount) || !Number.isFinite(numericInterest) || !Number.isInteger(numericMonths) || numericAmount < 0 || numericInterest < 0 || numericMonths <= 0) {
      setError("Ingresa valores válidos. El monto y el interés no pueden ser negativos, y los meses deben ser mayores a cero.");
      setResults(null);
      return;
    }

    const interestRate = numericInterest / 100;
    const monthlyPayment = interestRate === 0
      ? numericAmount / numericMonths
      : numericAmount * (interestRate * (1 + interestRate) ** numericMonths) / ((1 + interestRate) ** numericMonths - 1);
    const totalPayment = monthlyPayment * numericMonths;

    setError("");
    setResults({ monthlyPayment, totalPayment, totalInterest: totalPayment - numericAmount });
  }

  function clear() {
    setAmount("");
    setMonthlyInterest("");
    setMonths("");
    setResults(null);
    setError("");
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
        <form onSubmit={calculate} className="card p-6 md:p-8">
          <div className="mb-7 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Calculator /></span>
            <div><h2 className="text-xl font-black">Datos del préstamo</h2><p className="mt-1 text-sm text-[#8e9cb1]">Ingresa las condiciones del préstamo.</p></div>
          </div>
          <div><label className="label" htmlFor="loan-amount">Monto del préstamo</label><input id="loan-amount" className="input" type="number" min="0" step="0.01" inputMode="decimal" placeholder="Ejemplo: 10000.00" value={amount} onChange={(event) => setAmount(event.target.value)} /></div>
          <div className="mt-5"><label className="label" htmlFor="monthly-interest">Interés mensual en porcentaje</label><input id="monthly-interest" className="input" type="number" min="0" step="0.01" inputMode="decimal" placeholder="Ejemplo: 1.50" value={monthlyInterest} onChange={(event) => setMonthlyInterest(event.target.value)} /></div>
          <div className="mt-5"><label className="label" htmlFor="loan-months">Número de meses</label><input id="loan-months" className="input" type="number" min="1" step="1" inputMode="numeric" placeholder="Ejemplo: 12" value={months} onChange={(event) => setMonths(event.target.value)} /></div>
          {error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200">{error}</p>}
          <div className="mt-7 flex flex-wrap gap-3"><button type="submit" className="btn-primary"><Calculator size={17} /> Calcular</button><button type="button" className="btn-secondary" onClick={clear}><RotateCcw size={17} /> Limpiar</button></div>
        </form>
        <section className="card p-6 md:p-8" aria-live="polite">
          <div className="mb-7 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><CircleDollarSign /></span><div><h2 className="text-xl font-black">Resultados</h2><p className="mt-1 text-sm text-[#8e9cb1]">Resumen aproximado del préstamo.</p></div></div>
          <div className="grid gap-4"><Result label="Cuota mensual aproximada" value={results ? currency.format(results.monthlyPayment) : "S/ 0.00"} highlight /><Result label="Total a pagar" value={results ? currency.format(results.totalPayment) : "S/ 0.00"} /><Result label="Interés total" value={results ? currency.format(results.totalInterest) : "S/ 0.00"} /></div>
        </section>
      </div>
      <section className="card mt-6 p-6 md:p-8">
        <div className="flex items-start gap-4"><span className="mt-1 grid size-10 shrink-0 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><Info size={20} /></span><div><h2 className="text-lg font-black">¿Cómo se calcula la cuota de un préstamo?</h2><p className="mt-3 leading-7 text-[#98a7bc]">La cuota fija se calcula usando el monto solicitado, la tasa de interés mensual y el número de meses. Cada cuota incluye una parte del capital y otra de intereses. El resultado es aproximado y puede variar según comisiones, seguros u otros cargos de la entidad financiera.</p></div></div>
      </section>
    </>
  );
}

function Result({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div className="rounded-2xl border border-white/10 bg-[#080e19] p-5"><p className="text-sm font-bold text-[#8e9cb1]">{label}</p><p className={`mt-2 break-words text-2xl font-black sm:text-3xl ${highlight ? "text-[#62d6ff]" : "text-white"}`}>{value}</p></div>;
}
