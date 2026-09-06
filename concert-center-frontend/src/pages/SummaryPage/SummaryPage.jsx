import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { API_URL, BASE_FEE, DELIVERY_FEE } from '../../config/constants';

const SummaryPage = () => {
  const navigate = useNavigate();
  const { product, quantity, deliveryInfo } = useSelector((state) => state.cart);

  const subtotal = product ? product.price * quantity : 0;
  const total = subtotal + BASE_FEE + DELIVERY_FEE;

  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (!product || !deliveryInfo) {
      toast.error('Faltan datos para resumen');
      navigate('/');
    }
  }, [product, deliveryInfo, navigate]);

  const handlePay = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/transactions/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: product.id,
          eventName: product.name,
          quantity: quantity,
          unitPrice: product.price,
          baseFee: BASE_FEE,
          deliveryFee: DELIVERY_FEE,
          totalAmount: total,
          deliveryInfo: deliveryInfo
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          toast.success('¡Pago exitoso!');
          navigate('/result');
        }
      } else {
        toast.error(data.message || 'Error al crear la transacción');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  if (!product || !deliveryInfo) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white py-10">
      <div className="max-w-md mx-auto px-4">
        <button onClick={() => navigate('/payment')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <FaArrowLeft /> Volver a pago
        </button>

        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">
          Resumen de Compra
        </h1>

        <div className="flex items-center gap-4 bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 mb-6 backdrop-blur-sm">
          <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover shadow-lg" />
          <div className="flex-1">
            <h2 className="text-lg font-bold truncate">{product.name}</h2>
            <p className="text-sm text-gray-400">{product.description}</p>
            <p className="text-purple-400 font-semibold">${product.price.toLocaleString()} <span className="text-gray-400 font-normal text-xs">c/u</span></p>
          </div>
          <span className="bg-gray-700/50 text-gray-300 text-xs font-bold px-2 py-1 rounded-full">
            x{quantity}
          </span>
        </div>

        <div className="bg-gray-900/70 border border-gray-700/50 rounded-2xl p-6 mb-6 space-y-3">
          <h3 className="font-bold text-lg mb-4">Detalle de costos</h3>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-gray-200 font-semibold">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Comisión base</span>
            <span className="text-gray-200 font-semibold">${BASE_FEE.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Envío de boletas</span>
            <span className="text-gray-200 font-semibold">${DELIVERY_FEE.toLocaleString()}</span>
          </div>
          
          <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
            <span className="font-bold text-lg">Total a pagar</span>
            <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
              ${total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-gray-900/70 border border-gray-700/50 rounded-2xl p-6 mb-8 space-y-3">
          <h3 className="font-bold text-lg mb-4">📦 Entrega</h3>
          
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-400">Nombre</p>
              <p className="font-semibold">{deliveryInfo.fullName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-400">Dirección</p>
              <p className="font-semibold">{deliveryInfo.address}, {deliveryInfo.city}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handlePay}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl font-bold text-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? 'Creando transacción...' : <><FaCreditCard /> Paga con Wompi</>}
        </button>
      </div>
    </div>
  );
};

export default SummaryPage;