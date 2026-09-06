import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProductPage from './pages/ProductPage/ProductPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import SummaryPage from './pages/SummaryPage/SummaryPage';
import ResultPage from './pages/ResultPage/ResultPage';

const toastOptions = {
  duration: 3000,
  style: {
    background: '#363636',
    color: '#fff',
  },
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
      <Toaster position="top-center" toastOptions={toastOptions} />
    </>
  );
}

export default App;