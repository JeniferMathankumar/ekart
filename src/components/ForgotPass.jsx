import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import userService from "../service/user.service";
import { getStrength, validateEmail, validateOtp, validatePassword } from "../utils/commonFunctions";
import "../assets/css/forgot.css";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function Forgot() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConPassword, setShowConPassword] = useState(false);
    const [timer, setTimer] = useState(30);
    const [otpSent, setOtpSent] = useState(false);
    const [otpverified, setOtpVerified] = useState(false);

    const [loading, setLoading] = useState(false);

 const {token,role} = useSelector((state) => state.profile);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!otpSent || timer <= 0) return;

        const interval =
            setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);

        return () => clearInterval(interval);

    }, [otpSent, timer]);

    const handleChange = (value, index) => {

        // Allow only numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);

        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };
    const sendOtp = async (e) => {
        e.preventDefault();
        setErrors({});
        setOtp(["", "", "", "", "", ""]);

        if (!validateEmail(email)) {
            setErrors(preverr => ({
                ...preverr,
                email: "Please enter valid email"
            }));
            setLoading(false);
            return;
        }

        try {

            setLoading(true);

            const response =
                await userService.forgot_password({ email });

            toast.success(response.data.message);

            setOtpSent(true);

        } catch (error) {

            toast.error(
                error.response?.data?.message || error.response?.data?.errors[0] ||
                "Failed to send OTP"
            );

        } finally {
            setLoading(false);
        }
    };
    const verifyOTP = async (e) => {
        e.preventDefault();

        console.log("OTP:", otp);
        console.log("Type:", typeof otp);

        const otpvale = otp.join("");
        console.log("AFTER OTP:", otpvale);
        setErrors({});
        const returnvalue = validateOtp(otpvale);
        const substring = returnvalue.substring();

        if (validateOtp(otpvale)) {
            setErrors(preverr => ({ ...preverr, otp: validateOtp(otpvale) }));
            return true;
        }
        setLoading(true);

        const verifyotp = ({ email: email, otp: otpvale })
        await userService.verify_otp(verifyotp)
            .then(response => {
                toast.success(response.data.message);
                setOtpVerified(true);
            }).catch(error => {
                toast.error(
                    error.response?.data?.message || error.response?.data?.errors[0] ||
                    "OTP verification failed"
                );
            }).finally(
                setLoading(false)
            );



    }

    const handleResetPassword = async (e) => {

        e.preventDefault();

        setErrors({});

        if (!validatePassword(password)) {

            setErrors(preverr => ({
                ...preverr,
                password:
                    "Password must contain minimum 8 characters"
            }));

            return;
        }
        if (!validatePassword(confirmPassword)) {

            setErrors(preverr => ({
                ...preverr,
                confirmPassword:
                    "Password must contain minimum 8 characters"
            }));

            return;
        }

        if (password !== confirmPassword) {

            setErrors(prev => ({
                ...prev,
                confirmPassword:
                    "Passwords do not match"
            }));

            return;
        }

        try {

            setLoading(true);

            const reset = {
                newPassword: password,
                email: email
            };

            const response =
                await userService.reset_password(reset);

            toast.success(response.data.message);

            navigate("/auth/login");

        } catch (error) {

            toast.error(
                error.response?.data?.message || error.response?.data?.errors[0] ||
                "Password reset failed"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="forgot-container">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .5 }}>
                <div className="forgot-card">

                    {/* HEADER */}

                    <div className="text-center mb-4">

                        <div className="lock-icon">
                            🔐
                        </div>

                        <h2 className="fw-bold mt-3">
                            Forgot Password
                        </h2>

                        <p className="text-muted">
                            Securely reset your account password
                        </p>

                    </div>

                    {/* STEP INDICATOR */}

                    <div className="step-container">

                        <div
                            className={`step ${!otpSent
                                ? "active"
                                : "completed"
                                }`}
                        >
                            1
                        </div>

                        <div className="step-line"></div>

                        <div
                            className={`step ${otpSent && !otpverified
                                ? "active" : otpverified ?
                                    "completed" : ""
                                }`}
                        >
                            2
                        </div>
                        <div className="step-line"></div>

                        <div
                            className={`step ${otpverified
                                ? "active"
                                : ""
                                }`}
                        >
                            3
                        </div>

                    </div>

                    {/* EMAIL FIELD */}

                    <form>

                        <div className="form-floating mb-3 position-relative">

                            <FaEnvelope className="input-icon" />

                            <input
                                type="email"
                                className={`form-control ps-5 ${errors.email
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                placeholder="Email"
                                value={email}
                                disabled={otpSent}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                            <label className="ps-5">
                                Email Address
                            </label>

                        </div>

                        {errors.email && (
                            <div className="text-danger small mb-3">
                                {errors.email}
                            </div>
                        )}
                        {
                            otpverified &&
                            <motion.div className="mb-3"
                                initial={{
                                    scale: 0
                                }}
                                animate={{
                                    scale: 1
                                }}>
                                ✅ OTP Verified
                            </motion.div>
                        }
                        {/* OTP Field */}

                        {otpSent && !otpverified && (
                            <>
                                <div>
                                    <label>Enter OTP</label>
                                    <div className="d-flex gap-2 justify-content-center">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                maxLength="1"
                                                value={digit}
                                                className="form-control text-center"
                                                style={{ width: "50px" }}
                                                onChange={(e) =>
                                                    handleChange(e.target.value, index)
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Backspace" &&
                                                        !otp[index] &&
                                                        index > 0
                                                    ) {
                                                        document
                                                            .getElementById(
                                                                `otp-${index - 1}`
                                                            )
                                                            .focus();
                                                    }

                                                }}
                                            />
                                        ))}

                                    </div>
                                </div>
                                {errors.otp && (
                                    <small className="text-danger mb-2">
                                        {errors.otp}
                                    </small>
                                )}
                                {
                                    timer > 0
                                        ? (
                                            <small className=" d-flex justify-content-end">
                                                Resend OTP in {timer}s
                                            </small>
                                        )
                                        : (
                                            <button
                                                type="button"
                                                className=" btn btn-link d-flex justify-content-end"
                                                onClick={sendOtp}
                                            >
                                                Resend OTP
                                            </button>
                                        )
                                }
                            </>
                        )}



                        {/* RESET SECTION */}
                        {otpverified &&
                            <div
                                className={`reset-section ${otpverified
                                    ? "show"
                                    : ""
                                    }`}
                            >

                                <div className="form-floating mb-3 position-relative">

                                    <FaLock className="input-icon" />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className={`form-control ps-5 pe-5 ${errors.password
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <label className="ps-5">
                                        New Password
                                    </label>

                                    <span
                                        className="eye-icon"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {
                                            showPassword
                                                ? <FaEyeSlash />
                                                : <FaEye />
                                        }
                                    </span>

                                </div>
                                <div className="form-floating mb-3 position-relative">

                                    <FaLock className="input-icon" />

                                    <input
                                        type={
                                            showConPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className={`form-control ps-5 pe-5 ${errors.confirmPassword
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        placeholder="Password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <label className="ps-5">
                                        Confirm Password
                                    </label>

                                    <span
                                        className="eye-icon"
                                        onClick={() =>
                                            setShowConPassword(
                                                !showConPassword
                                            )
                                        }
                                    >
                                        {
                                            showConPassword
                                                ? <FaEyeSlash />
                                                : <FaEye />
                                        }
                                    </span>

                                </div>
                                {password && (

                                    <>
                                        <div className="progress mb-2">

                                            <div
                                                className={`progress-bar ${getStrength(password) === "Strong"
                                                    ? "bg-success"
                                                    : getStrength(password) === "Medium"
                                                        ? "bg-warning"
                                                        : "bg-danger"
                                                    }`}
                                                style={{
                                                    width:
                                                        getStrength(password) === "Strong"
                                                            ? "100%"
                                                            : getStrength(password) === "Medium"
                                                                ? "60%"
                                                                : "30%"
                                                }}
                                            />

                                        </div>

                                        <small>

                                            Password Strength :

                                            <span
                                                className={`ms-2 fw-bold ${getStrength(password) === "Strong"
                                                    ? "text-success"
                                                    : getStrength(password) === "Medium"
                                                        ? "text-warning"
                                                        : "text-danger"
                                                    }`}
                                            >
                                                {getStrength(password)}
                                            </span>

                                        </small>

                                    </>
                                )}

                                {errors.password && (

                                    <div className="text-danger small mt-2">
                                        {errors.password}
                                    </div>

                                )}

                            </div>

                        }

                        {/* BUTTON */}

                        <button
                            type="button"
                            className="btn btn-primary w-100 mt-4 py-2 fw-bold"
                            disabled={loading}
                            onClick={
                                !otpSent
                                    ? sendOtp : otpSent && !otpverified ? verifyOTP
                                        : handleResetPassword
                            }>
                            {
                                loading
                                    ? (
                                        <>
                                            <div className="loading-overlay">

                                                <div
                                                    className=" spinner-border text-light"
                                                />
                                            </div>
                                            Reset Password
                                        </>

                                    )
                                    : !otpSent
                                        ? "Send OTP" : otpSent && !otpverified ? "Verify OTP"
                                            : "Reset Password"

                            }

                        </button>


                    </form>

                </div>
            </motion.div>
        </div>

    );
}



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import userService from "../service/user.service";
// import { validateEmail, validatePassword } from "../utils/commonFunctions";
// import { FaAt, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

// const style1 = {
//     position: 'absolute',
//     top: '50%',
//     left: '12px',
//     transform: 'translateY(-50%)'
// }

// // Icon styling
// const style2 = {
//     position: 'absolute',
//     top: '50%',
//     right: '10px',
//     transform: 'translateY(-50%)',
//     cursor: 'pointer',
//     background: 'white', // This cuts the border and separates the icon from the error state
//     padding: '2px 5px',  // Adds a little space around the icon
//     zIndex: 10,          // Ensures it stays on top
//     color: '#6c757d'     // Optional: Matches standard Bootstrap input icon color
// };
// // Helper for input padding to prevent text overlap with the right icon
// const inputPaddingStyle = {
//     padding: '12px 45px 12px 40px' // Right padding (45px) leaves room for the Eye icon
// };
// export default function Forgot() {

//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showpassword, setShowpassword] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [showResetFields, setShowResetFields] = useState(false);
//     const [token, setToken] = useState(localStorage.getItem("token") ||
//         sessionStorage.getItem("token"));
//     const [errormsg, setErrorMsg] = useState({});
//     const navigate = useNavigate();

//     function handleForgotPassword(e) {
//         e.preventDefault();
//         setErrorMsg({});

//         if (!validateEmail(email)) {
//             setErrorMsg(prevMsg => ({ ...prevMsg, "email": "Please enter valid email" }))
//             return;
//         }
//         setLoading(true);
//         const emailPayload = { email };
//         userService.forgot_password(emailPayload).then(response => {
//             console.log(response.data);
//             setLoading(false);
//             window.alert(response.data.message);
//             if (response.status == 200) {
//                 setToken(response.data.token);
//                 setShowResetFields(true);
//             }
//         }).catch(error => {
//             setLoading(false);
//             console.log(error);
//             window.alert(error.response?.data?.message || error.message);
//         });
//     }
//     function handleResetPassword(e) {
//         e.preventDefault();
//         setErrorMsg({});

//         if (!validatePassword(password)) {
//             setErrorMsg(prevMsg => ({ ...prevMsg, "password": "Password atleast must be 8 characters" }))

//             return;
//         }
//         setLoading(true);
//         const reset = { newPassword: password, token };
//         userService.reset_password(reset)
//             .then(response => {
//                 console.log("RESET", response.data);

//                 window.alert(response.data.message);
//                 // Redirect to login page
//                 navigate('/auth/login')
//                 setShowResetFields(false);
//                 setEmail("");
//                 setPassword("");
//             }).catch(error => {

//                 console.log(error.message);
//                 window.alert(error.response?.data?.message || "Reset failed");
//             }).finally(() => {
//                 setLoading(false);
//             }
//             );
//     }
//     return (
//         <>
//             <div className="container p-3 d-flex flex-column justify-content-center">
//                 <div className="card m-auto w-75 justify-content-center">
//                     <h2 className="d-flex justify-content-center pt-3">Forgot Password</h2>
//                     <form className="form m-5">

//                         {/* Container for the entire group (Input + Error) */}
//                         <div className="mb-3">
//                             <label>Email*</label>
//                             {/* Wrapper ONLY for Icon + Input. This keeps the height fixed so the icon doesn't jump. */}
//                             <div style={{ position: 'relative' }}>
//                                 <FaAt style={style1} />
//                                 <input
//                                     className={`form-control ${errormsg.email ? 'is-invalid' : ''}`}
//                                     style={{ padding: '12px 12px 12px 40px' }}
//                                     type="email"
//                                     id="email"
//                                     value={email}
//                                     placeholder="Enter email"
//                                     required
//                                     onChange={(e) => setEmail(e.target.value)}
//                                 />
//                             </div>
//                             {/* Error message is OUTSIDE the wrapper, so it won't affect icon position */}
//                             {errormsg.email && (
//                                 <div className="invalid-feedback d-block">
//                                     {errormsg.email}
//                                 </div>
//                             )}
//                         </div>
//                         {showResetFields && (
//                             <div className="mb-3">
//                                 <label>Password*</label>
//                                 <div style={{ position: 'relative' }}>
//                                     {/* Lock Icon (Left) */}
//                                     <FaLock style={style1} />

//                                     {/* Eye Icon (Right) - Fixed with background and z-index */}
//                                     <span style={style2} onClick={() => setShowpassword(!showpassword)}>
//                                         {showpassword ? <FaEyeSlash /> : <FaEye />}
//                                     </span>

//                                     {/* Input - Added specific padding for the right icon */}
//                                     <input
//                                         className={`form-control ${errormsg.password ? 'is-invalid' : ''}`}
//                                         style={inputPaddingStyle}
//                                         type={showpassword ? "text" : "password"}
//                                         id="password"
//                                         value={password}
//                                         placeholder="Enter password"
//                                         required
//                                         onChange={(e) => setPassword(e.target.value)}
//                                     />
//                                 </div>

//                                 {/* Error Message */}
//                                 {errormsg.password && <div className="invalid-feedback d-block">{errormsg.password}</div>}

//                             </div>
//                         )}
//                         <div className="d-flex justify-content-center">
//                             {showResetFields ? (
//                                 <button type="button" className="btn btn-primary" disabled={loading} onClick={handleResetPassword}>
//                                     {loading ? (
//                                         <>
//                                             <p style={{ margin: '0px' }}>
//                                                 <span className="spinner-border spinner-border-sm"></span>&nbsp; Loading
//                                             </p>

//                                         </>
//                                     ) :
//                                         "Reset Password"
//                                     }
//                                 </button>
//                             ) : (
//                                 <button type="button" className="btn btn-primary " disabled={loading} onClick={handleForgotPassword}>

//                                     {loading ? (
//                                         <p style={{ margin: '0px' }}>
//                                             <span className="spinner-border spinner-border-sm"></span>&nbsp; Loading
//                                         </p>

//                                     ) :
//                                         "Send Link"
//                                     }
//                                 </button>
//                             )}
//                         </div>


//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// }