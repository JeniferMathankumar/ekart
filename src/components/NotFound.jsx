import { Link } from "react-router-dom";

export default function NotFound() {

    return (

        <div className="notfound-container">

            <div className="glass-card">

                <h1 className="error-code">
                    404
                </h1>

                <h2>
                    Lost in Space 🚀
                </h2>

                <p>
                    We couldn't find the page
                    you're looking for.
                </p>

                <Link
                    to="/"
                    className="btn btn-home mt-3"
                >
                    Go Home
                </Link>

            </div>

        </div>

    );
}