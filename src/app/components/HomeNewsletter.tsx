import { useTenant } from "@/contexts/tenant-context";

export function HomeNewsletter() {
  const { tenant } = useTenant();
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Fique por dentro das novidades</h2>
        <p className="text-gray-400 mb-8">
          Cadastre-se para receber ofertas exclusivas e novidades em primeira mão.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Seu melhor email"
            className="flex-1 px-6 py-4 rounded-lg text-gray-900"
          />
          <button
            type="submit"
            className="px-8 py-4 font-medium rounded-lg transition-colors"
            style={{ backgroundColor: tenant?.primaryColor || "#3b82f6" }}
          >
            Cadastrar
          </button>
        </form>
      </div>
    </section>
  );
}
