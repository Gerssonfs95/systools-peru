"use client";

import { Check, Clipboard, KeyRound, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

const characterSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{};:,.?",
};

type Option = keyof typeof characterSets;
type Strength = "Débil" | "Media" | "Fuerte";

export function PasswordGenerator() {
  const [length, setLength] = useState("16");
  const [options, setOptions] = useState<Record<Option, boolean>>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<Strength | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function generate(event: React.FormEvent) {
    event.preventDefault();
    const numericLength = Number(length);
    const selectedSets = Object.entries(options).filter(([, selected]) => selected).map(([name]) => characterSets[name as Option]);

    if (!Number.isInteger(numericLength) || numericLength < 8 || numericLength > 64) {
      setError("La longitud debe ser un número entero entre 8 y 64.");
      clearResult();
      return;
    }

    if (selectedSets.length === 0) {
      setError("Selecciona al menos una opción de caracteres.");
      clearResult();
      return;
    }

    const required = selectedSets.map((set) => randomCharacter(set));
    const pool = selectedSets.join("");
    const remaining = Array.from({ length: numericLength - required.length }, () => randomCharacter(pool));
    const generated = shuffle([...required, ...remaining]).join("");

    setPassword(generated);
    setStrength(getStrength(numericLength, selectedSets.length));
    setError("");
    setCopied(false);
  }

  async function copyPassword() {
    if (!password) {
      setError("Genera una contraseña antes de copiarla.");
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setError("");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar automáticamente. Selecciona la contraseña y cópiala manualmente.");
    }
  }

  function clear() {
    setLength("16");
    setOptions({ uppercase: true, lowercase: true, numbers: true, symbols: true });
    setPassword("");
    setStrength(null);
    setError("");
    setCopied(false);
  }

  function clearResult() {
    setPassword("");
    setStrength(null);
    setCopied(false);
  }

  function toggleOption(option: Option) {
    setOptions((current) => ({ ...current, [option]: !current[option] }));
    setCopied(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
      <form onSubmit={generate} className="card p-6 md:p-8">
        <div className="mb-7 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><KeyRound /></span>
          <div><h2 className="text-xl font-black">Configura tu contraseña</h2><p className="mt-1 text-sm text-[#8e9cb1]">Elige la longitud y los tipos de caracteres.</p></div>
        </div>

        <label className="label" htmlFor="password-length">Longitud de contraseña</label>
        <input id="password-length" className="input" type="number" min="8" max="64" step="1" inputMode="numeric" value={length} onChange={(event) => setLength(event.target.value)} />

        <fieldset className="mt-6 grid gap-3 sm:grid-cols-2">
          <legend className="label mb-3">Opciones de caracteres</legend>
          <OptionCheckbox label="Incluir mayúsculas" checked={options.uppercase} onChange={() => toggleOption("uppercase")} />
          <OptionCheckbox label="Incluir minúsculas" checked={options.lowercase} onChange={() => toggleOption("lowercase")} />
          <OptionCheckbox label="Incluir números" checked={options.numbers} onChange={() => toggleOption("numbers")} />
          <OptionCheckbox label="Incluir símbolos" checked={options.symbols} onChange={() => toggleOption("symbols")} />
        </fieldset>

        {error && <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200">{error}</p>}
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="submit" className="btn-primary"><Sparkles size={17} /> Generar contraseña</button>
          <button type="button" className="btn-secondary" onClick={clear}><RotateCcw size={17} /> Limpiar</button>
        </div>
      </form>

      <section className="card p-6 md:p-8" aria-live="polite">
        <div className="mb-7 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><ShieldCheck /></span>
          <div><h2 className="text-xl font-black">Contraseña generada</h2><p className="mt-1 text-sm text-[#8e9cb1]">Lista para usar y copiar.</p></div>
        </div>

        <div className="min-h-28 rounded-2xl border border-white/10 bg-[#080e19] p-5">
          <p className="break-all font-mono text-lg font-bold leading-8 text-[#62d6ff]">{password || "Tu contraseña aparecerá aquí"}</p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[.025] px-4 py-3">
          <span className="text-sm font-bold text-[#8e9cb1]">Seguridad</span>
          <StrengthBadge strength={strength} />
        </div>

        <button type="button" className="btn-primary mt-6 w-full" onClick={copyPassword}>
          {copied ? <Check size={17} /> : <Clipboard size={17} />} {copied ? "Contraseña copiada" : "Copiar contraseña"}
        </button>
      </section>
    </div>
  );
}

function OptionCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#080e19] px-4 py-3 text-sm font-bold text-[#c9d5e8] transition hover:border-[#16a8ff]/50"><input type="checkbox" checked={checked} onChange={onChange} className="size-4 accent-[#16a8ff]" />{label}</label>;
}

function StrengthBadge({ strength }: { strength: Strength | null }) {
  const colors = strength === "Fuerte" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : strength === "Media" ? "border-amber-400/20 bg-amber-400/10 text-amber-300" : "border-red-400/20 bg-red-400/10 text-red-300";
  return <span className={`rounded-full border px-3 py-1 text-xs font-black ${strength ? colors : "border-white/10 bg-white/5 text-[#8e9cb1]"}`}>{strength ?? "Sin generar"}</span>;
}

function randomCharacter(characters: string) {
  const randomValue = new Uint32Array(1);
  crypto.getRandomValues(randomValue);
  return characters[randomValue[0] % characters.length];
}

function shuffle(characters: string[]) {
  for (let index = characters.length - 1; index > 0; index--) {
    const randomValue = new Uint32Array(1);
    crypto.getRandomValues(randomValue);
    const target = randomValue[0] % (index + 1);
    [characters[index], characters[target]] = [characters[target], characters[index]];
  }
  return characters;
}

function getStrength(length: number, selectedSetCount: number): Strength {
  if (length >= 16 && selectedSetCount >= 3) return "Fuerte";
  if (length >= 12 && selectedSetCount >= 2) return "Media";
  return "Débil";
}
