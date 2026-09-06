import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setDeliveryInfo, setQuantity } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaCreditCard, FaUser, FaEnvelope, FaMapMarkerAlt, FaCity } from 'react-icons/fa';

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product } = useSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    fullName: '', email: '', address: '', city: ''
  });

  React.useEffect(() => {
    if (!product) {
      toast.error('Selecciona un evento primero');
      navigate('/');
    }
  }, [product, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Al quitar los amigos, la cantidad siempre es 1
  const totalQuantity = 1;
  const totalToPay = product ? product.price * totalQuantity : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setQuantity(1));
    dispatch(setDeliveryInfo({
      fullName: formData.fullName,
      email: formData.email,
      address: formData.address,
      city: formData.city,
    }));
    navigate('/summary');
  };

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white py-10">
      <div className="max-w-md mx-auto px-4">
        
        {/* Botón de volver */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <FaArrowLeft /> Volver a eventos
        </button>

        {/* Mini tarjeta del evento (Contexto) */}
        <div className="flex items-center gap-4 bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 mb-8 backdrop-blur-sm">
          <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover shadow-lg" />
          <div className="flex-1">
            <h2 className="text-lg font-bold truncate">{product.name}</h2>
            <p className="text-sm text-gray-400">{product.description}</p>
            <p className="text-purple-400 font-semibold">${product.price.toLocaleString()} <span className="text-gray-400 font-normal text-xs">/ boleta</span></p>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-white">Datos de Entrega</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Información de envío */}
          <div className="bg-gray-900/70 border border-gray-700/50 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nombre completo</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3.5 text-gray-500" />
                <input 
                  type="text" 
                  name="fullName" 
                  placeholder="Tu nombre y apellido" 
                  required 
                  onChange={handleChange} 
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Correo electrónico</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3.5 text-gray-500" />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="tucorreo@ejemplo.com" 
                  required 
                  onChange={handleChange} 
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Dirección de envío</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-500" />
                <input 
                  type="text" 
                  name="address" 
                  placeholder="Calle, número y apartamento" 
                  required 
                  onChange={handleChange} 
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ciudad</label>
              <div className="relative">
                <FaCity className="absolute left-3 top-3.5 text-gray-500" />
                <input 
                  type="text" 
                  name="city" 
                  placeholder="Manizales" 
                  required 
                  onChange={handleChange} 
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Bloque de Total */}
          <div className="bg-gray-900/70 border border-gray-700/50 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Tu inscripción (1 boleta)</span>
              <span className="text-gray-200 font-semibold">${totalToPay.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
              <span className="font-bold text-lg">Total a pagar</span>
              <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">${totalToPay.toLocaleString()}</span>
            </div>
          </div>

          {/* Botón estilo Premium */}
          <button 
            type="submit" 
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl font-bold text-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 flex items-center justify-center gap-2"
          >
            <FaCreditCard /> Paga con Wompi
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;