interface Props {
  readonly description: string | null;
}

export function ProductDescription({ description }: Props) {
  if (!description) return null;
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Descrição</h2>
      <div className="prose max-w-none text-gray-600">{description}</div>
    </div>
  );
}
