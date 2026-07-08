import { FaTools, FaRocket, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function NotCreated() {

    const navigate = useNavigate();
  return (

        <div className="notfound-container d-flex justify-content-center align-items-center  p-sm-1">

            <div className="glass-card p-5">

                <FaTools className="error-code">
                    
                </FaTools>

                <h2 className="pb-1">
                     Coming Soon 🚀
                </h2>

                 <h5 className="pb-1">
                     This Page is Under Development
                </h5>

                <p>
                    We're working hard to bring you an amazing experience.&nbsp;<br/>
                    New features will be available very soon.
                </p>

                <Link
                    to="/"
                    className="btn btn-home mt-3"
                >
                    <FaRocket className="me-2"/>
                    Go Home
                </Link>

            </div>

        </div>

    );
}