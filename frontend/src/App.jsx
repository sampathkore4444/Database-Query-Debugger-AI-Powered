// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import InboxPage from './pages/InboxPage';
import LoginPage from './pages/LoginPage';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-pulse font-bold text-slate-400">Loading Secure Environment...</div></div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/inbox" element={
                    <ProtectedRoute>
                        <InboxPage />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/inbox" replace />} />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
