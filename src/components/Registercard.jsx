import { useState } from "react";
import { FaAt, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import userService from "../service/user.service.js";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import '../assets/css/common.css'
import { validateEmail, validatePassword } from "../utils/commonFunctions.js";

// Reusing styles defined in the original file
const style1 = {
    position: 'absolute',
    top: '50%',
    left: '12px',
    transform: 'translateY(-50%)'
}

// Icon styling
const style2 = {
    position: 'absolute',
    top: '50%',
    right: '10px',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    background: 'white', // This cuts the border and separates the icon from the error state
    padding: '2px 5px',  // Adds a little space around the icon
    zIndex: 10,          // Ensures it stays on top
    color: '#6c757d'     // Optional: Matches standard Bootstrap input icon color
};

export default function Register() {
    const [name, setname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showpassword, setShowpassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errormsg, setErrorMsg] = useState({});

    const navigate = useNavigate();

    function handleRegister(e) {
        e.preventDefault();
        setErrorMsg({});

        // Basic Validation
        if (!name) {
            setErrorMsg(prev => ({ ...prev, "name": "Name is required" }));
            return;
        }
        if (!validateEmail(email)) {
            setErrorMsg(prev => ({ ...prev, "email": "Please enter valid email" }));
            return;
        }
        if (!validatePassword(password)) {
            setErrorMsg(prev => ({ ...prev, "password": "Password atleast must be 8 characters " }));
            return;
        }
        setLoading(true);
        const register = { name, email, password };

        userService.register(register).then(response => {
            // console.log("res", response.data);
            window.alert("Registration Successful! Please Login.");
            navigate("/auth/login");
        }).catch(error => {
            console.log("errr", error);
            window.alert(error.response?.data?.message || error.message || "Registration failed");
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <>
            <div className="container d-flex flex-column justify-content-center">
                 <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .5 }}>
                <div className="login-card mx-auto w-75 justify-content-center">
                    <h2 className="d-flex justify-content-center pt-3">Register form</h2>

                    <form className="form m-3" onSubmit={handleRegister}>
                        {/* Name Field */}
                        <div className="mb-3">
                            <label>Name<span className="text-danger">*</span></label>
                            <div style={{ position: 'relative' }}>
                                <FaUser style={style1} />
                                <input
                                    className={`form-control ${errormsg.name ? 'is-invalid' : ''}`}
                                    style={{ padding: '12px 12px 12px 40px' }}
                                    type="text"
                                    id="name"
                                    value={name}
                                    placeholder="Enter full name"
                                    required
                                    onChange={(e) => setname(e.target.value)}
                                />
                            </div>
                            {errormsg.name &&
                                <div className="invalid-feedback">
                                    {errormsg.name}</div>}
                        </div>

                        {/* Email Field */}
                        <div className="mb-3">
                            <label>Email<span className="text-danger">*</span></label>
                            <div style={{ position: 'relative' }}>
                                <FaAt style={style1} />
                                <input
                                    className={`form-control ${errormsg.email ? 'is-invalid' : ''}`}
                                    style={{ padding: '12px 12px 12px 40px' }}
                                    type="email"
                                    id="email"
                                    value={email}
                                    placeholder="Enter email"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {errormsg.email && <div
                                className="invalid-feedback d-block">{errormsg.email}</div>}
                        </div>
                        {/* Password Field */}
                        <div className="mb-3">
                            <label>Password<span className="text-danger">*</span></label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={style1} />
                                <span style={style2} onClick={() => setShowpassword(!showpassword)}>
                                    {showpassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                <input
                                    className={`form-control ${errormsg.password ? 'is-invalid' : ''}`}
                                    style={{ padding: '12px 40px 12px 40px' }}
                                    type={showpassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    placeholder="Enter password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {errormsg.password && <div className="invalid-feedback d-block">{errormsg.password}</div>}
                        </div>

                        <button type="submit" className="btn btn-success w-100 mt-4" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm"></span>
                                    &nbsp; Registering...
                                </>
                            ) : "Register"}
                        </button>

                        <p className="d-flex justify-content-center pt-2">
                            Already have an account? <span className="text-primary"><a className="nav-link" href="/auth/login">&nbsp;Login</a></span>
                        </p>
                    </form>
            
                </div>
                </motion.div>
            </div>
        </>
    );
}