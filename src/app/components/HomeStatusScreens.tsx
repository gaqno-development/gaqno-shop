export function HomeLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

export function HomeErrorScreen({ message }: { readonly message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Erro</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
