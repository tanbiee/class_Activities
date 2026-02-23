import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfessionProvider } from "./contexts/ConfessionContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <ConfessionProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Navigate to="/feed" />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/feed" />} />
          </Routes>
        </BrowserRouter>
      </ConfessionProvider>
    </AuthProvider>
  );
}

export default App;
