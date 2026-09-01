import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route untuk halaman riwayat pesanan user */}
        {/* <Route path="/user/reservations" element={<UserReservationsPage />} /> */}

        {/* Route default jika akses root */}
        <Route path="/" element={<div className="p-8 text-center font-bold">Welcome to Property App! Silakan buka /user/reservations</div>} />
      </Routes>
    </Router>
  );
}