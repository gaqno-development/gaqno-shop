interface Props {
  readonly notes: string | null;
}

export function OrderNotes({ notes }: Props) {
  if (!notes) return null;
  return (
    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
      <h2 className="text-lg font-semibold mb-2">Observações</h2>
      <p className="text-gray-700">{notes}</p>
    </div>
  );
}
