import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaTicketAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { setProducts, setLoading, setError } from '../../store/slices/productSlice';
import { setProduct } from '../../store/slices/cartSlice';

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((state) => state.product);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const categories = ['Todos', 'Premium', 'VIP', 'General'];

  // ⬇️ NUEVO: Detectar si venimos de Wompi (hay un ?id= en la URL) y redirigir al resultado
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get('id');

    if (transactionId) {
      toast.success('¡Pago procesado!');
      navigate('/result');
    }
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();
    const loadProducts = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(`${API_URL}/events`, { signal: controller.signal });
        const data = await response.json();
        dispatch(setProducts(data));
      } catch (err) {
        if (err.name !== 'AbortError') {
          dispatch(setError(err.message));
          toast.error('Error al cargar eventos');
        }
      }
    };
    loadProducts();
    return () => controller.abort();
  }, [dispatch, API_URL]);

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.style === selectedCategory);

  const handleBuy = (product) => {
    if (product.stock <= 0) {
      toast.error('Evento sin boletas disponibles');
      return;
    }
    dispatch(setProduct(product));
    navigate('/payment');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <section className="bg-gradient-to-r from-purple-900 via-fuchsia-900 to-purple-950 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">🎵 Centro de Conciertos</h1>
        <p className="text-purple-200">Vive la mejor experiencia musical</p>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-900/70 rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-700/50">
              <div className="h-48 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-white">{product.name}</h3>
                <p className="text-sm text-gray-400">{product.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                    ${product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleBuy(product)}
                    disabled={product.stock === 0}
                    className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${
                      product.stock === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-400'
                    }`}
                  >
                    <FaTicketAlt /> Boletas
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">🎟️ Stock: {product.stock} disponibles</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;