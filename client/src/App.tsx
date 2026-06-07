import './App.css';
import TablePage from './pages/TablePage';
import Layout from './layout/Layout';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import AddTablePage from './pages/AddTablePage';
import { AdminBookingsPage } from './pages/AdminBookingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/tables" replace />} />
            <Route path="/tables" element={<TablePage />} />
            <Route path="/login" element={<ProtectedRoute guestOnly><LoginPage /></ProtectedRoute>} />
            <Route path="/register" element={<ProtectedRoute guestOnly><RegisterPage /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/add-table" element={<ProtectedRoute requireAdmin><AddTablePage /></ProtectedRoute>} />
            <Route path="/admin/received-bookings" element={<ProtectedRoute requireAdmin><AdminBookingsPage /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;