interface Props {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function NotesSection({ value, onChange }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <label className="block text-sm font-medium mb-2">Observações (opcional)</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        rows={3}
        placeholder="Alguma observação sobre o pedido?"
      />
    </div>
  );
}
