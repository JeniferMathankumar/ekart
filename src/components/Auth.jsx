import { useParams } from "react-router-dom";
import Login from "./Logincard";
import Register from "./Registercard";
import Forgot from "./ForgotPass";
import Homecard from "./Homecard";
import NotFound from "./NotFound";
import loginbg from '../assets/loginbg.avif'

function Auth() {
    const url = useParams();
    console.log("url", url);
    return (
        <div className="container-fluid vh-100 m-0 p-0"
        >
            <div className="row h-100 w-100 p-0 m-0"
            >
                {url.mode === 'forgot-pass'
                    ?
                    <div className=" d-flex justify-content-center align-items-center">
                        <Forgot />
                    </div>
                    : url.mode === 'login' || url.mode === 'register' ?
                        <>
                            {/* Left Side */}
                            <div
                                className="col-md-6 p-0 m-0 login-left"
                                style={{
                                    backgroundImage: `url(${loginbg})`,
                                }}
                            >
                                {/* Dark Overlay */}
                                <div className="overlay"></div>

                                {/* Floating Icons */}
                                <div className="icons">
                                    <span>🛒</span>
                                    <span>📦</span>
                                    <span>💳</span>
                                    <span>🚚</span>
                                    <span>🏷️</span>
                                    <span>❤️</span>
                                </div>

                                {/* Content */}
                                <div className="content">
                                    <h1 className="typing">
                                        Welcome Back ❤️ &nbsp; 
                                    </h1>

                                    <p className="lead mt-4">
                                        Your shopping journey starts here.
                                        <br />
                                        Secure • Fast • Reliable
                                    </p>
                                </div>
                            </div>

                            {/* Right Side */}
                            <div className="col-md-6 m-0 p-0 d-flex justify-content-center align-items-center">
                                {url.mode === 'login' ? <Login /> : <Register />}
                            </div>
                        </>
                        :
                        <NotFound />

                }



            </div>
        </div>


    )
}
export default Auth;