import {
  Calculator,
  ChartNoAxesCombined,
  CircleDollarSign,
  Gauge,
  KeyRound,
  MonitorCog,
  Network,
  Percent,
  RefreshCw,
  ShieldCheck,
  Wifi,
  Wrench,
} from "lucide-react";

const icons = {
  Calculator,
  ChartNoAxesCombined,
  CircleDollarSign,
  Gauge,
  KeyRound,
  MonitorCog,
  Network,
  Percent,
  RefreshCw,
  ShieldCheck,
  Wifi,
  Wrench,
};

export const availableToolIcons = Object.keys(icons);

export function ToolIcon({ name, size = 24 }: { name?: string | null; size?: number }) {
  const Icon = icons[name as keyof typeof icons] || Wrench;
  return <Icon size={size} />;
}
