"use client";

type Entry = { id: number; gate_id: number; plate_number: string; status?: string; entry_time?: string };

type Props = { data?: Entry[]; entries?: Entry[]; filteredEntries?: Entry[]; selectedId?: number | null; selectedGate?: unknown; loadingEntries?: boolean; onSelect?: (id: number) => void; [key: string]: unknown };

export default function GateEntriesTable({ data, entries, filteredEntries, selectedId, onSelect }: Props) {
  const rows = filteredEntries ?? data ?? entries ?? [];
  return <div className="overflow-x-auto"><table className="w-full"><tbody>{rows.map((entry) => <tr key={entry.id} onClick={() => onSelect?.(entry.id)} className={selectedId === entry.id ? "bg-accent" : ""}><td>{entry.gate_id}</td><td>{entry.plate_number}</td><td>{entry.status ?? "-"}</td></tr>)}</tbody></table></div>;
}
