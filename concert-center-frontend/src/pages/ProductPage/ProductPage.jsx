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

  // ⬇️ ESTA ES LA LÍNEA MÁGICA QUE FALTA
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get('id');

    if (transactionId) {
      toast.success('¡Pago procesado!');
      navigate('/result');
    }
  }, [navigate]);

  // ... (el resto del código de carga de productos que ya tenías)
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
    // ... (El resto de tu JSX de la página de productos)
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <section className="bg-gradient-to-r from-purple-900 via-fuchsia-900 to-purple-950 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">🎵 Centro de Conciertos</h1>
        <p className="text-purple-200">Vive la mejor experiencia musical</p>
      </section>
      {/* ... (Asegúrate de mantener el resto del renderizado que ya tienes) */}
    </div>
  );
};

export default ProductPage;