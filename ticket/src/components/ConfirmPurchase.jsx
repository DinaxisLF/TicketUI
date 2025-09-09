import React, { useState } from "react";
import TheaterImage from "../assets/teatro.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Login.jsx";

export default function ConfirmPurchase() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Sample purchase data (would come from your state management)
  const [purchaseData, setPurchaseData] = useState({
    event: {
      title: "Concierto de Rock Nacional",
      date: "15 Octubre 2023",
      time: "20:00 - 23:00",
      location: "Auditorio Nacional, CDMX",
      image: TheaterImage,
    },
    tickets: [
      { name: "General", quantity: 2, price: 25.99, section: "General" },
      { name: "VIP", quantity: 1, price: 129.99, section: "VIP" },
    ],
    seats: ["General A3", "General A4", "VIP B2"],
    total: 181.97,
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setShowPaymentModal(true);
    // Reset errors when opening modal
    setErrors({
      number: "",
      name: "",
      expiry: "",
      cvv: "",
    });
  };

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiration date as MM/YY
  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, "").substring(0, 4);
    if (v.length === 0) return "";
    if (v.length <= 2) return v;
    return `${v.substring(0, 2)}/${v.substring(2)}`;
  };

  const validateCardNumber = (number) => {
    // Remove spaces for validation
    const cleanNumber = number.replace(/\s/g, "");

    if (!cleanNumber) {
      return "El número de tarjeta es requerido";
    } else if (!/^\d+$/.test(cleanNumber)) {
      return "El número de tarjeta solo debe contener dígitos";
    } else if (cleanNumber.length !== 16) {
      return "El número de tarjeta debe tener 16 dígitos";
    }
    return "";
  };

  const validateName = (name) => {
    if (!name) {
      return "El nombre del titular es requerido";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
      return "El nombre solo debe contener letras y espacios";
    }
    return "";
  };

  const validateExpiry = (expiry) => {
    if (!expiry) {
      return "La fecha de expiración es requerida";
    }

    const [month, year] = expiry.split("/");

    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return "Formato inválido (use MM/AA)";
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (monthNum < 1 || monthNum > 12) {
      return "Mes inválido";
    }

    if (
      yearNum < currentYear ||
      (yearNum === currentYear && monthNum < currentMonth)
    ) {
      return "La tarjeta ha expirado";
    }

    return "";
  };

  const validateCvv = (cvv) => {
    if (!cvv) {
      return "El CVV es requerido";
    } else if (!/^\d+$/.test(cvv)) {
      return "El CVV solo debe contener dígitos";
    } else if (cvv.length < 3 || cvv.length > 4) {
      return "El CVV debe tener 3 o 4 dígitos";
    }
    return "";
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Apply formatting based on field type
    if (name === "number") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiry") {
      formattedValue = formatExpiry(value);
    } else if (name === "cvv") {
      // Only allow digits for CVV
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setCardData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Validate in real-time but don't show error until blur
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "number":
        error = validateCardNumber(value);
        break;
      case "name":
        error = validateName(value);
        break;
      case "expiry":
        error = validateExpiry(value);
        break;
      case "cvv":
        error = validateCvv(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      number: validateCardNumber(cardData.number),
      name: validateName(cardData.name),
      expiry: validateExpiry(cardData.expiry),
      cvv: validateCvv(cardData.cvv),
    };

    setErrors(newErrors);

    // Check if there are any errors
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Don't proceed if there are validation errors
    }

    setPaymentProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false);
      alert("¡Pago procesado exitosamente! Su compra ha sido confirmada.");
      setShowPaymentModal(false);
      navigate("/summary");
    }, 2000);
  };

  const handlePayPalPayment = () => {
    setPaymentProcessing(true);

    // Simulate PayPal payment
    setTimeout(() => {
      setPaymentProcessing(false);
      alert(
        "¡Pago con PayPal procesado exitosamente! Su compra ha sido confirmada."
      );
      setShowPaymentModal(false);
      navigate("/summary");
    }, 2000);
  };

  const renderPaymentModal = () => {
    switch (selectedPaymentMethod) {
      case "credit":
      case "debit":
        return (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              {selectedPaymentMethod === "credit"
                ? "Tarjeta de Crédito"
                : "Tarjeta de Débito"}
            </h3>

            <form onSubmit={handleCardSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  name="number"
                  value={cardData.number}
                  onChange={handleCardInputChange}
                  onBlur={handleInputBlur}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.number ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength={19} // 16 digits + 3 spaces
                  required
                />
                {errors.number && (
                  <p className="mt-1 text-sm text-red-600">{errors.number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Titular
                </label>
                <input
                  type="text"
                  name="name"
                  value={cardData.name}
                  onChange={handleCardInputChange}
                  onBlur={handleInputBlur}
                  placeholder="Juan Pérez"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Expiración (MM/AA)
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handleCardInputChange}
                    onBlur={handleInputBlur}
                    placeholder="MM/AA"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.expiry ? "border-red-500" : "border-gray-300"
                    }`}
                    maxLength={5}
                    required
                  />
                  {errors.expiry && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardInputChange}
                    onBlur={handleInputBlur}
                    placeholder="123"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.cvv ? "border-red-500" : "border-gray-300"
                    }`}
                    maxLength={4}
                    required
                  />
                  {errors.cvv && (
                    <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {paymentProcessing ? "Procesando..." : "Pagar $181.97"}
                </button>
              </div>
            </form>
          </div>
        );

      case "paypal":
        return (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Pago con PayPal</h3>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full mr-3">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.2 18.4c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2zm0-3.1c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9zm9.5 3.1c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2zm0-3.1c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9zm1.5-2.5H7.7c-.4 0-.7.3-.7.7s.3.7.7.7h10.5c.4 0 .7-.3.7-.7s-.3-.7-.7-.7zM7.2 14.7c-.1 0-.2 0-.3-.1-.3-.2-.4-.6-.2-.9l2.1-3.4c.2-.3.6-.4.9-.2.3.2.4.6.2.9l-2.1 3.4c-.1.2-.3.3-.6.3zm9.5 0c-.1 0-.2 0-.3-.1-.3-.2-.4-.6-.2-.9l2.1-3.4c.2-.3.6-.4.9-.2.3.2.4.6.2.9l-2.1 3.4c-.1.2-.3.3-.6.3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">
                    Serás redirigido a PayPal para completar tu pago
                  </p>
                  <p className="text-sm text-yellow-700">
                    Total a pagar: $181.97
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-lg">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.2 18.4c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2zm0-3.1c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9zm9.5 3.1c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2zm0-3.1c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9zm1.5-2.5H7.7c-.4 0-.7.3-.7.7s.3.7.7.7h10.5c.4 0 .7-.3.7-.7s-.3-.7-.7-.7zM7.2 14.7c-.1 0-.2 0-.3-.1-.3-.2-.4-.6-.2-.9l2.1-3.4c.2-.3.6-.4.9-.2.3.2.4.6.2.9l-2.1 3.4c-.1.2-.3.3-.6.3zm9.5 0c-.1 0-.2 0-.3-.1-.3-.2-.4-.6-.2-.9l2.1-3.4c.2-.3.6-.4.9-.2.3.2.4.6.2.9l-2.1 3.4c-.1.2-.3.3-.6.3z" />
                </svg>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handlePayPalPayment}
                disabled={paymentProcessing}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-yellow-400"
              >
                {paymentProcessing ? "Redirigiendo..." : "Pagar con PayPal"}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Resumen de Compra
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={purchaseData.event.image}
                alt={purchaseData.event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {purchaseData.event.title}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{purchaseData.event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{purchaseData.event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{purchaseData.event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Detalles de tu compra
              </h3>

              {/* Tickets Summary */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Boletos</h4>
                <div className="space-y-2">
                  {purchaseData.tickets.map((ticket, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm p-2 bg-gray-50 rounded"
                    >
                      <span>
                        {ticket.quantity} x {ticket.name} ({ticket.section})
                      </span>
                      <span className="font-medium">
                        ${(ticket.price * ticket.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seats Summary */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">
                  Asientos seleccionados
                </h4>
                <div className="flex flex-wrap gap-2">
                  {purchaseData.seats.map((seat, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${purchaseData.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">
                  Selecciona método de pago
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => handlePaymentMethodSelect("credit")}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-8 h-8 text-gray-600 mb-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                      </svg>
                      <span>Tarjeta de Crédito</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodSelect("debit")}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-8 h-8 text-gray-600 mb-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                      </svg>
                      <span>Tarjeta de Débito</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodSelect("paypal")}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-8 h-8 text-blue-600 mb-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.2 18.4c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2zm0-3.1c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9zm9.5 3.1c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2zm0-3.1c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9zm1.5-2.5H7.7c-.4 0-.7.3-.7.7s.3.7.7.7h10.5c.4 0 .7-.3.7-.7s-.3-.7-.7-.7zM7.2 14.7c-.1 0-.2 0-.3-.1-.3-.2-.4-.6-.2-.9l2.1-3.4c.2-.3.6-.4.9-.2.3.2.4.6.2.9l-2.1 3.4c-.1.2-.3.3-.6.3zm9.5 0c-.1 0-.2 0-.3-.1-.3-.2-.4-.6-.2-.9l2.1-3.4c.2-.3.6-.4.9-.2.3.2.4.6.2.9l-2.1 3.4c-.1.2-.3.3-.6.3z" />
                      </svg>
                      <span>PayPal</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                  <span className="text-sm text-green-700">
                    Tu información de pago está protegida con encriptación de
                    grado bancario.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {renderPaymentModal()}
          </div>
        </div>
      )}
    </div>
  );
}
