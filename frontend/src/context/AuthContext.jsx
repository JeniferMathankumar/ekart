import { createContext, useContext, useEffect, useRef, useState } from "react";
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from "react-router-dom";
import { persistor } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/profile/profileSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const dispatch = useDispatch();
    const { token, role } = useSelector((state) => state.profile);
    // const [user, setUser] = useState(null);

    const login = (token,
        //userData, rememberMe
    ) => {
        // rememberMe ? localStorage.setItem("token", token) : sessionStorage.setItem("token", token);
        // const useData = localStorage.setItem("userInfo", userData);
        // console.log(userData);
        setIsAuthenticated(true);
        startTokenTimer(token);
    }
    useEffect(() => {
        if (token) {
            startTokenTimer(token);
        }
    }, []);
    const logout = async () => {
        dispatch({
            type: "RESET_APP"
        });
        await persistor.pause();
        await persistor.flush();
        await persistor.purge();
        

        localStorage.removeItem("persist:root");

        window.location.replace("/auth/login");
    }
    const timeoutRef = useRef(null);
    const startTokenTimer = (token) => {
        const decoded = jwtDecode(token);
        console.log("DECODED JWT", decoded);

        const expiryTime = decoded.exp * 1000;
        const currentTime = Date.now();
        const remainingTime = expiryTime - currentTime;
        console.log("remainingTime" + remainingTime);
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor(
            (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor(
            (remainingTime % (1000 * 60)) / 1000
        );

        if (remainingTime < 0) {
            console.log("TIMEOUT EXECUTED");
            alert("Session expired. Please login again.");
            logout();
            window.location.href = "/auth/login";
            return;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        console.log(`${hours}h ${minutes}m ${seconds}s`);
        if (remainingTime > 0) {
            console.log("TIMEOUT EXECUTED");
            timeoutRef.current = setTimeout(() => {
                alert("Session expired. Please login again.");
                logout();
                window.location.href = "/auth/login";
            }, remainingTime);
        }
    };



    return (
        <AuthContext.Provider
            value={{ isAuthenticated, login, logout, startTokenTimer }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);