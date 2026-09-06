import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome } from 'react-icons/fa';
import { resetCheckout } from '../../store/slices/cartSlice';

const ResultPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, quantity } = useSelector((state) => state.cart);

  const handleBackHome = () => {
    dispatch(resetCheckout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="bg-gray-900 p-10 rounded-2xl border border-purple-800 text-center max-w-md w-full">
        <FaCheckCircle className="w-20 h-20 text-purple-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">¡Compra exitosa!</h1>
        <p className="text-gray-400 mb-6">
          Tu reserva para <strong className="text-white">{product?.name}</strong> ({quantity} {quantity === 1 ? 'boleta' : 'boletas'}) ha sido confirmada.
        </p>
        
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