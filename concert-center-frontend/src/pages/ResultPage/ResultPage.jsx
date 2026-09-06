import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaHome } from 'react-icons/fa';
import { resetCheckout } from '../../store/slices/cartSlice';

const ResultPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, quantity } = useSelector((state) => state.cart);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const params = new URLSearchParams(window.location.search);
  const transactionId = params.get('id');

  const [transactionStatus, setTransactionStatus] = useState(null);

  // Consultar el estado real de la transacción a Wompi
  useEffect(() => {
    const checkStatus = async () => {
      if (transactionId) {
        try {
          const response = await fetch(`${API_URL}/transactions/status/${transactionId}`);
          const data = await response.json();
          if (data.success) {
            setTransactionStatus(data.status);
          } else {
            setTransactionStatus('ERROR');
          }
        } catch (error) {
          console.error(error);
        }
      } else if (!product) {
        navigate('/');
      }
    };
    checkStatus();
  }, [transactionId, product, navigate, API_URL]);

  const handleBackHome = () => {
    dispatch(resetCheckout());
    navigate('/');
  };

  // Si no hay estado y no venimos de Wompi, mostrar el éxito local
  const displayName = product?.name || 'tu compra';
  const displayQuantity = product?.quantity || 1;

  const isSuccess = transactionStatus === 'APPROVED' || (!transactionStatus && product);
  const isError = transactionStatus === 'DECLINED' || transactionStatus === 'ERROR';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-10 rounded-2xl border border-purple-800 text-center max-w-md w-full">
        {isSuccess ? (
          <>
            <FaCheckCircle className="w-20 h-20 text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">¡Compra exitosa!</h1>
            <p className="text-gray-400 mb-6">
              Tu reserva para <strong className="text-white">{displayName}</strong> ({displayQuantity} {displayQuantity === 1 ? 'boleta' : 'boletas'}) ha sido confirmada.
            </p>
          </>
        ) : (
          <>
            <FaTimesCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Pago rechazado</h1>
            <p className="text-gray-400 mb-6">
              Lo sentimos, tu transacción para <strong className="text-white">{displayName}</strong> no pudo ser procesada.
            </p>
          </>
        )}

        <button 
          onClick={handleBackHome}
          className="w-full py-3 bg-purple-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-purple-400"
        >
          <FaHome /> Volver a eventos
        </button>
      </div>
    </div>
  );
};

export default ResultPage;