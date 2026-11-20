import { useState, useEffect } from 'react';
import CreateCinemaCard from '../components/booking/CreateCinemaCard';
import BookingQuoteCard from '../components/booking/BookingQuoteCard';
import CalculationResult from '../components/booking/CalculationResult';
import { bookingApi } from '../services/api';

export default function BookingPage() {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState('');
  const [groupSize, setGroupSize] = useState('35');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCinemas = async () => {
      try {
        const data = await bookingApi.getCinemas();
        setCinemas(data);
        setSelectedCinemaId(data[0]?.id || '');
      } catch (apiError) {
        setError(apiError.message);
      }
    };

    loadCinemas();
  }, []);

  const activeCinema = cinemas.find((c) => c.id === selectedCinemaId);

  const handleCreateCinema = async (newCinema) => {
    setError('');
    try {
      const created = await bookingApi.createCinema(newCinema);
      setCinemas((current) => [...current, created]);
      setSelectedCinemaId(created.id);
      return true;
    } catch (apiError) {
      setError(apiError.message);
      return false;
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    const seats = Number(groupSize);
    if (!seats || !activeCinema) return;

    setError('');
    try {
      const apiResult = await bookingApi.getQuote(activeCinema.id, seats);
      setResult(apiResult);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleExample = async (seats) => {
    setGroupSize(String(seats));
    if (!activeCinema) return;
    setError('');
    try {
      setResult(await bookingApi.getQuote(activeCinema.id, seats));
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pt-10">
      <div className="font-mono-tech flex items-center gap-2 text-[10px] tracking-widest text-[#f59e0b] uppercase">
        <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
        <span>Operational Console</span>
      </div>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white">
        Cinema Allocation &amp; Booking
      </h1>
      <p className="mt-1 text-xs text-slate-400">
        Configure auditorium bundle metrics and compute minimum bundle seat fills for Marvel Doomsday screenings.
      </p>

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
        <CreateCinemaCard onCreate={handleCreateCinema} />
        <BookingQuoteCard
          cinemas={cinemas}
          selectedCinemaId={selectedCinemaId}
          onSelectCinema={setSelectedCinemaId}
          groupSize={groupSize}
          onGroupSizeChange={setGroupSize}
          onCalculate={handleCalculate}
        />
      </div>

      {result && (
        <CalculationResult
          result={result}
          activeSeats={groupSize}
          onSelectExample={handleExample}
        />
      )}
    </div>
  );
}