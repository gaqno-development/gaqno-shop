"use client";

import { Upload } from "lucide-react";
import type { ChangeEvent } from "react";
import type { BakeryDecoration } from "@/types/bakery";
import type { UseBakeryProductOptionsReturn } from "../hooks/useBakeryProductOptions";

interface Props {
  readonly options: UseBakeryProductOptionsReturn;
  readonly decorations: readonly BakeryDecoration[];
  readonly leadDays?: number | null;
}

export function BakeryProductOptions({ options, decorations, leadDays }: Props) {
  const {
    sizes,
    size,
    setSize,
    notes,
    setNotes,
    allowsReferenceImage,
    referenceImageUrl,
    uploadImage,
    isUploading,
    uploadError,
    decorationQuantities,
    setDecorationSelected,
  } = options;

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void uploadImage(file);
  };

  return (
    <div className="mt-8 space-y-6 border-t border-[var(--mist)] pt-6">
      {leadDays && leadDays > 0 ? (
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
          Pedido sob encomenda — {leadDays} {leadDays === 1 ? "dia" : "dias"} úteis
          de antecedência
        </p>
      ) : null}

      <SizeSection sizes={sizes} value={size} onChange={setSize} />

      {decorations.length > 0 ? (
        <DecorationsSection
          decorations={decorations}
          quantities={decorationQuantities}
          onSelect={setDecorationSelected}
        />
      ) : null}

      {allowsReferenceImage ? (
        <ReferenceImageSection
          imageUrl={referenceImageUrl}
          isUploading={isUploading}
          error={uploadError}
          onChange={onFile}
        />
      ) : null}

      <NotesSection value={notes} onChange={setNotes} />
    </div>
  );
}

function SizeSection({
  sizes,
  value,
  onChange,
}: {
  readonly sizes: readonly string[];
  readonly value: string;
  readonly onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
        Tamanho
      </p>
      <div className="mt-2 flex gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
              value === s
                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                : "border-[var(--mist)] text-[var(--ink)] hover:bg-[var(--mist)]/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function DecorationsSection({
  decorations,
  quantities,
  onSelect,
}: {
  readonly decorations: readonly BakeryDecoration[];
  readonly quantities: Record<string, number>;
  readonly onSelect: (id: string, selected: boolean) => void;
}) {
  return (
    <div>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
        Decorações adicionais
      </p>
      <ul className="mt-2 space-y-2">
        {decorations.map((d) => {
          const selected = (quantities[d.id] ?? 0) > 0;
          return (
            <li
              key={d.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-[var(--mist)] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm text-[var(--ink)]">{d.name}</p>
                <p className="font-mono text-[0.68rem] text-[var(--ink-muted)]">
                  + R$ {d.priceAdjustment}
                </p>
              </div>
              <DecorationSwitch
                checked={selected}
                onChange={(next) => onSelect(d.id, next)}
                label={`Incluir ${d.name}`}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DecorationSwitch({
  checked,
  onChange,
  label,
}: {
  readonly checked: boolean;
  readonly onChange: (next: boolean) => void;
  readonly label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-11 shrink-0 rounded-full border transition-colors ${
        checked
          ? "border-[var(--ink)] bg-[var(--ink)]"
          : "border-[var(--mist)] bg-[var(--mist)]/35"
      }`}
    >
      <span
        className={`pointer-events-none absolute top-1 left-1 h-5 w-5 rounded-full bg-[var(--paper)] shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function ReferenceImageSection({
  imageUrl,
  isUploading,
  error,
  onChange,
}: {
  readonly imageUrl: string;
  readonly isUploading: boolean;
  readonly error: string | null;
  readonly onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
        Imagem de referência
      </p>
      <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[var(--mist)] px-4 py-3 text-sm text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]">
        <Upload className="h-4 w-4" />
        <span>
          {isUploading
            ? "Enviando…"
            : imageUrl
              ? "Imagem enviada — enviar outra"
              : "Clique para enviar uma foto"}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
          disabled={isUploading}
        />
      </label>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Referência"
          className="mt-3 h-24 w-24 rounded-lg object-cover"
        />
      ) : null}
      {error ? (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

function NotesSection({
  value,
  onChange,
}: {
  readonly value: string;
  readonly onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
        Observações
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Ex: escrever 'Feliz aniversário, Maria'"
        className="mt-2 w-full rounded-lg border border-[var(--mist)] bg-transparent px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[var(--ink)] focus:outline-none"
      />
    </div>
  );
}
