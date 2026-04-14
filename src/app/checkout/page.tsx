"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CreditCard, QrCode, Receipt, Truck, Package, Check, Lock } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import { useCart } from "@/contexts/cart-context";
import { createCheckout, calculateShipping, validateCoupon, type CheckoutData } from "@/lib/api";
import { R2_PUBLIC_URL } from "@/lib/api";

const BRAZIL_STATES = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];

type PaymentMethod = "credit_card" | "pix" | "boleto";

function CheckoutContent() {
  const router = useRouter();
  const { tenant } = useTenant();
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card");
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Form states
  const [customer, setCustomer] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    document: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "BR",
    phone: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "BR",
    phone: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      router.push("/carrinho");
    }
  }, [cart, router]);

  // Calculate shipping when address changes
  useEffect(() => {
    async function fetchShipping() {
      if (shippingAddress.zip.length === 8) {
        try {
          const items = cart?.items.map(item => ({ productId: item.productId, quantity: item.quantity })) || [];
          const options = await calculateShipping(shippingAddress.zip, items);
          setShippingOptions(options || []);
          if (options?.length > 0) {
            setSelectedShipping(options[0]);
          }
        } catch (error) {
          console.error("Failed to calculate shipping:", error);
        }
      }
    }
    fetchShipping();
  }, [shippingAddress.zip, cart]);

  const handleApplyCoupon = async () => {
    if (!couponCode || !cart) return;
    try {
      const result = await validateCoupon(couponCode, cart.subtotal);
      if (result.valid) {
        setDiscount(result.discount);
      }
    } catch (error) {
      console.error("Invalid coupon:", error);
    }
  };

  const handleSubmit = async () => {
    if (!cart) return;
    setIsSubmitting(true);

    try {
      const checkoutData: CheckoutData = {
        customer,
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        paymentMethod,
        couponCode: couponCode || undefined,
        notes: notes || undefined,
      };

      const result = await createCheckout("session-id", checkoutData);
      
      if (result.orderNumber) {
        setOrderNumber(result.orderNumber);
        setOrderComplete(true);
        clearCart();
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Erro ao finalizar compra. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Pedido Confirmado!</h1>
        <p className="text-gray-600 mb-2">Obrigado pela sua compra.</p>
        <p className="text-lg font-semibold mb-8">Número do pedido: {orderNumber}</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Continuar Comprando
          </Link>
          <Link
            href={`/pedidos?email=${encodeURIComponent(customer.email)}`}
            className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Ver Meus Pedidos
          </Link>
        </div>
      </div>
    );
  }

  if (!cart) return null;

  const shippingCost = selectedShipping?.price || 0;
  const total = cart.subtotal + shippingCost - discount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/carrinho" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ChevronLeft className="h-5 w-5" />
          Voltar ao carrinho
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Contato
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone *</label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <input
                  type="text"
                  value={customer.firstName}
                  onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sobrenome *</label>
                <input
                  type="text"
                  value={customer.lastName}
                  onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CPF/CNPJ</label>
                <input
                  type="text"
                  value={customer.document}
                  onChange={(e) => setCustomer({ ...customer, document: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Endereço de Entrega
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">CEP *</label>
                <input
                  type="text"
                  value={shippingAddress.zip}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  maxLength={8}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Endereço *</label>
                <input
                  type="text"
                  value={shippingAddress.address1}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address1: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Número/Complemento</label>
                <input
                  type="text"
                  value={shippingAddress.address2}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address2: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cidade *</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado *</label>
                <select
                  value={shippingAddress.province}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Selecione</option>
                  {BRAZIL_STATES.map((state) => (
                    <option key={state.code} value={state.code}>{state.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shipping Options */}
            {shippingOptions.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Opções de Frete</h3>
                <div className="space-y-2">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedShipping?.id === option.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShipping?.id === option.id}
                          onChange={() => setSelectedShipping(option)}
                          className="text-blue-600"
                        />
                        <div>
                          <p className="font-medium">{option.name}</p>
                          <p className="text-sm text-gray-500">Entrega em {option.deliveryTime} dias úteis</p>
                        </div>
                      </div>
                      <span className="font-semibold">
                        {option.price === 0 ? "Grátis" : `R$ ${option.price.toFixed(2).replace(".", ",")}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Pagamento
            </h2>
            
            <div className="space-y-3">
              <label
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "credit_card" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "credit_card"}
                  onChange={() => setPaymentMethod("credit_card")}
                  className="text-blue-600"
                />
                <CreditCard className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="font-medium">Cartão de Crédito</p>
                  <p className="text-sm text-gray-500">Até 12x sem juros</p>
                </div>
              </label>

              <label
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "pix" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "pix"}
                  onChange={() => setPaymentMethod("pix")}
                  className="text-blue-600"
                />
                <QrCode className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="font-medium">PIX</p>
                  <p className="text-sm text-gray-500">5% de desconto</p>
                </div>
              </label>

              <label
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "boleto" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "boleto"}
                  onChange={() => setPaymentMethod("boleto")}
                  className="text-blue-600"
                />
                <Receipt className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="font-medium">Boleto Bancário</p>
                  <p className="text-sm text-gray-500">Vencimento em 3 dias</p>
                </div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white p-6 rounded-lg border">
            <label className="block text-sm font-medium mb-2">Observações (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
              placeholder="Alguma observação sobre o pedido?"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

            {/* Items */}
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="h-16 w-16 bg-white rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl ? `${R2_PUBLIC_URL}/${item.imageUrl}` : "/placeholder-product.png"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                    <p className="text-sm font-semibold">R$ {item.total.toFixed(2).replace(".", ",")}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Cupom de desconto"
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
              >
                Aplicar
              </button>
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {cart.subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span>{shippingCost === 0 ? "Grátis" : `R$ ${shippingCost.toFixed(2).replace(".", ",")}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>-R$ {discount.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              <div className="pt-4 border-t flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedShipping}
              className="w-full py-4 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
            >
              <Lock className="h-4 w-4" />
              {isSubmitting ? "Processando..." : "Finalizar Compra"}
            </button>

            <p className="mt-4 text-center text-xs text-gray-500">
              Pagamento processado com segurança
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
