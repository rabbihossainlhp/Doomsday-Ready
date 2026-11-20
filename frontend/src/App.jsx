import { useState } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import MoviesPage from './pages/MoviesPage';
import RewatchPlanPage from './pages/RewatchPlanPage';
import BookingPage from './pages/BookingPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('movies');

  return (
    <div className="flex min-h-screen flex-col bg-[#07111e] text-slate-100">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1">
        {activeTab === 'movies' && <MoviesPage />}
        {activeTab === 'rewatch' && <RewatchPlanPage />}
        {activeTab === 'booking' && <BookingPage />}
      </main>
      <Footer />
    </div>
  );
}