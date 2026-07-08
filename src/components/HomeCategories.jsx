import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../assets/css/homecategories.css";

export default function HomeCategories() {

    const navigate = useNavigate();

    const { items: categories } = useSelector((state) => state.category);

    const [localCategories, setLocalCategories] = useState([]);

    useEffect(() => {

        if (Array.isArray(categories)) {
            setLocalCategories(categories);
        }
        else if (Array.isArray(categories?.data)) {
            setLocalCategories(categories.data);
        }

    }, [categories]);

    return (

        <section className="container my-5">

            {/* Heading */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">
                        Shop by Categories
                    </h2>

                    <p className="text-muted mb-0">
                        Find products from your favourite categories
                    </p>

                </div>

                <button
                    className="btn btn-success rounded-pill px-lg-4"
                    onClick={() => navigate("/category")}
                >
                    
                    <FaArrowRight className="" />
                </button>

            </div>

            {/* Categories */}

            <div className="row g-4 justify-content-center">

                {localCategories
                    .slice(0, 4)
                    .map((cat) => (

                        <div
                            key={cat.id}
                            className="col-6 col-sm-4 col-md-3 col-lg-2"
                        >

                            <div
                                className="category-item"
                                onClick={() => navigate(`/category/${cat.id}`)}
                            >

                                <div className="category-circle">

                                    <img
                                        src={
                                            cat.imageUrl
                                                ? `${import.meta.env.VITE_BACKEND_URL}${cat.imageUrl}`
                                                : "https://placehold.co/200"
                                        }
                                        alt={cat.name}
                                    />

                                </div>

                                <h6 className="mt-3 fw-semibold">

                                    {cat.name}

                                </h6>

                                <small className="text-muted">

                                    {cat.productcount ?? 0} Products

                                </small>

                            </div>

                        </div>

                    ))}

            </div>

        </section>

    );

}