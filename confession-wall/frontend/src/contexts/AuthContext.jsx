import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    axios.defaults.baseURL = "http://localhost:3000";
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem("user");
            const token = localStorage.getItem("token");

            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post("/api/auth/login", { email, password });
            const { user, token } = res.data;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser(user);
            toast.success("Logged in successfully!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        }
    };

    const register = async (username, email, password) => {
        try {
            await axios.post("/api/auth/register", { username, email, password });
            toast.success("Registration successful! Please login.");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            return false;
        }
    };

    const googleLogin = async (credential) => {
        try {
            const res = await axios.post("/api/auth/google", { credential });
            const { user, token } = res.data;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser(user);
            toast.success("Google login successful!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Google login failed");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        toast.success("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
