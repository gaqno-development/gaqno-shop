"use client";

import { Upload, Minus, Plus } from "lucide-react";
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
    toggleDecoration,
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
          onToggle={toggleDecoration}
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
  onToggle,
}: {
  readonly decorations: readonly BakeryDecoration[];
  readonly quantities: Record<string, number>;
  readonly onToggle: (id: string, delta: number) => void;
}) {
  return (
    <div>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
        Decorações adicionais
      </p>
      <ul className="mt-2 space-y-2">
        {decorations.map((d) => {
          const qty = quantities[d.id] ?? 0;
          return (
            <li
              key={d.id}
              className="flex items-center justify-between rounded-lg border border-[var(--mist)] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm text-[var(--ink)]">{d.name}</p>
                <p className="font-mono text-[0.68rem] text-[var(--ink-muted)]">
                  + R$ {d.priceAdjustment}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggle(d.id, -1)}
                  disabled={qty === 0}
                  aria-label={`Remover ${d.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--ink)]"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-mono w-6 text-center text-sm tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => onToggle(d.id, 1)}
                  aria-label={`Adicionar ${d.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
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
