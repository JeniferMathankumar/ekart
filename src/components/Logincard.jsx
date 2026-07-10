import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaAt, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import userService from "../service/user.service.js";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from "../utils/commonFunctions.js";
import '../assets/css/login.css';
import { motion } from 'framer-motion'
import '../assets/css/common.css'
import { toast } from 'react-toastify'
import { clearProfile, LoginApi,clearProfileMessages } from "../features/profile/profileSlice.js";

const style1 = {
    position: 'absolute',
    top: '50%',
    left: '12px',
    transform: 'translateY(-50%)'
}

// Icon styling
const style2 = {
    position: "absolute",
    top: "50%",
    right: "15px",
    transform: "translateY(-50%)",
    cursor: "pointer",
    zIndex: 5,
    color: "#6c757d"
};

// Helper for input padding to prevent text overlap with the right icon
const inputPaddingStyle = {
    paddingRight: '45px' // Right padding (45px) leaves room for the Eye icon
};


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showpassword, setShowpassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showResetFields, setShowResetFields] = useState(false);
    const [errormsg, setErrorMsg] = useState({});
    const { login, startTokenTimer } = useAuth();
    const [rememberMe, setRememberMe] = useState(true);
    const { successMessage,token } = useSelector((state) => state.profile);
   
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const modalRef = useRef(null);
    const isFormValid =
        email.trim() &&
        password.trim().length >= 6;

    useEffect(() => {
        dispatch(clearProfile());
    }, []);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            login(token);
            dispatch(clearProfileMessages());
        }
    }, [successMessage,token, dispatch]);

    async function handleLogin(e) {
        e.preventDefault();
        setErrorMsg({}); // Clear previous errors

        // Simple client-side validation
        if (!validateEmail(email)) {
            setErrorMsg(prev => ({ ...prev, "email": "Please enter valid email" }));
            return;
        }
        if (!validatePassword(password)) {
            setErrorMsg(prev => ({ ...prev, "password": "Password must be at least 8 characters" }));
            return;
        }

        const logindata = { email, password };
       setLoading(true);
        const loginresponse = await dispatch(LoginApi(logindata));
        if (LoginApi.fulfilled.match(loginresponse)) {
            // console.log("Login successful:", loginresponse.payload);
            
            if (loginresponse.payload?.role === "ADMIN") {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
            setLoading(false);

        } else if (LoginApi.rejected.match(loginresponse)) {
            toast.error(loginresponse.payload?.data?.message || loginresponse.payload?.data?.errors?.message || "Login failed");
            setLoading(false);
        }

        // userService.login(logindata).then(response => {
        //     console.log("res", response.data);
        //     const userData = {
        //         username: response.data.data.username,
        //         email: response.data.data.email,
        //         role: response.data.data.role,
        //         tokenExpiry: response.data.data.tokenExpiry,
        //         profileImage: response.data.data.profileimage
        //     };
        //     login(response.data.data.token, JSON.stringify(userData), rememberMe);

        //     toast.update(toastId, {
        //         render: response.data?.message,
        //         type: 'success',
        //         autoClose: 3000,
        //         isLoading: false
        //     })
        //     navigate("/", { replace: true });


        // }).catch(error => {
        //     console.log("errr", error);
        //     toast.update(toastId, {
        //         render: error.response?.data?.message || error.response?.data?.errors?.message || "Login failed",
        //         type: "error",
        //         autoClose: 3000,
        //         isLoading: false
        //     })
        //     // window.alert(error.response?.data?.data?.message || error.message || "Login failed");
        // }).finally(() => {
        //     setLoading(false);
        // });
    }
    const getStrength = () => {
        if (password.length < 6) return "Weak";
        if (password.length < 8) return "Medium";
        return "Strong";
    };
    return (
        <>
            <div className="login-container p-0 d-flex flex-column justify-content-center">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .5 }}>

                    <div className="login-card p-5">
                        <h2 className="d-flex justify-content-center pt-3">Login form</h2>

                        <form className="form" onSubmit={handleLogin}>
                            {/* Container for the entire group (Input + Error) */}
                            <div className="mb-2">

                                {/* Wrapper ONLY for Icon + Input. This keeps the height fixed so the icon doesn't jump. */}
                                <div className="form-floating mb-3" style={{ position: 'relative' }}>
                                    {/* <FaAt style={style1} />
                                     */}
                                    <input
                                        className={`form-control ${errormsg.email ? 'is-invalid' : ''}`}
                                        type="email"
                                        id="email"
                                        value={email}
                                        placeholder="Enter email"
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label>Email ID</label>
                                </div>

                                {/* Error message is OUTSIDE the wrapper, so it won't affect icon position */}
                                {errormsg.email && (
                                    <div className="invalid-feedback d-block">
                                        {errormsg.email}
                                    </div>
                                )}
                            </div>
                            <br />
                            {/* PASSWORD FIELD */}
                            <div className="mb-3">
                                <div className="form-floating position-relative">
                                    <input
                                        className={`form-control ${errormsg.password ? "is-invalid" : ""
                                            }`}
                                        type={showpassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        placeholder="Password"
                                        style={inputPaddingStyle}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    <label htmlFor="password">
                                        Password
                                    </label>

                                    <span
                                        onClick={() =>
                                            setShowpassword(!showpassword)
                                        }
                                        style={style2}
                                    >
                                        {showpassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </span>
                                </div>

                                {/* Password Strength */}
                                {password && (
                                    <div className="progress mt-2" style={{ height: "6px" }}>
                                        <div className={`progress-bar ${getStrength() === "Strong"
                                            ? "bg-success"
                                            : getStrength() === "Medium"
                                                ? "bg-warning"
                                                : "bg-danger"
                                            }`}
                                            style={{
                                                width:
                                                    getStrength() === "Strong"
                                                        ? "100%"
                                                        : getStrength() === "Medium"
                                                            ? "60%"
                                                            : "30%"
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Error Message */}
                                {errormsg.password && (
                                    <div className="invalid-feedback d-block">
                                        {errormsg.password}
                                    </div>
                                )}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <input
                                        className="form-check-input"
                                        id="rememberMe"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => {
                                            setRememberMe(e.target.checked);
                                        }} />
                                    <span className="ms-2">Remember Me</span>
                                </div>

                                <a href="/auth/forgot-pass">
                                    Forgot Password?
                                </a>
                            </div>
                            <button type="submit" className="btn btn-success login-btn w-100 mt-3" disabled={!isFormValid || loading}>
                                {loading
                                    ? (
                                        <>
                                            {/* SPINNER WITH OVERLAY */}
                                            {/* <div className="loading-overlay">
                                                <div className="spinner-border text-light"></div>
                                            </div> */}
                                            <span className="spinner-border spinner-border-sm"></span>
                                            &nbsp; Loading
                                        </>
                                    ) : "Submit"}
                            </button>

                            <p className="d-flex justify-content-center pt-3">
                                Don't have an account? <span className="text-danger">
                                    <a className="nav-link" href="/auth/register">&nbsp;Register</a></span>
                            </p>
                        </form>
                    </div>
                </motion.div>

            </div>


        </>
    );
}