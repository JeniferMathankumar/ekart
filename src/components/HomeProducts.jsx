import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProductsAPI } from "../features/product/productSlice";
import { fetchAllCategoriesAPI } from "../features/category/categorySlice";
import { useNavigate } from "react-router-dom";
import "../assets/css/homecategories.css";
import { FaEye } from "react-icons/fa";

export default function HomeProducts() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedProduct, setSelectedProduct] = useState(null);

    const { items: products } = useSelector(state => state.product);
    const { items: categories } = useSelector(state => state.category);

    useEffect(() => {

        dispatch(fetchAllProductsAPI());
        dispatch(fetchAllCategoriesAPI());

    }, []);

    const productList = Array.isArray(products)
        ? products
        : products?.data || [];

    const categoryList = Array.isArray(categories)
        ? categories
        : categories?.data || [];

    const openProductModal = (product) => {
        setSelectedProduct(product);
    };

    const closeProductModal = () => {
        setSelectedProduct(null);
    };

    return (

        <div className="container my-5">

            {

                categoryList.map(category => {
                    console.log("Category:", category);
                    const categoryProducts = productList.filter(product =>
                        product.categoryId === category.id
                    );

                    if (categoryProducts.length === 0) return null;

                    return (

                        <div
                            key={category.id}
                            className="mb-5"
                        >

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <div>

                                    <h2 className="fw-bold">

                                        {category.name}

                                    </h2>

                                    <p className="text-muted">

                                        Explore our latest {category.name}

                                    </p>

                                </div>

                                <button
                                    className="btn btn-outline-primary rounded-pill"
                                    onClick={() =>
                                        navigate(`/category/${category.id}`)
                                    }
                                >

                                    View All

                                </button>

                            </div>

                            <div className="row g-4">

                                {categoryProducts
                                .slice(0, 4)
                                .map((product) => (

                                    <div
                                        key={product.id}
                                        className="col-12 col-sm-6 col-lg-3"
                                    >

                                        <div className="home-product-card">

                                            <div className="home-product-image">

                                                <img
                                                    src={product.imageUrl ? `${import.meta.env.VITE_BACKEND_URL}${product.imageUrl}` : "https://placehold.co/200"}
                                                    alt={product.name}
                                                />

                                                <span className="badge bg-success home-stock-badge">
                                                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                                </span>

                                            </div>
                                            <button
                                                className="btn btn-primary rounded-circle home-view-btn"
                                                aria-label={`View ${product.name}`}
                                                onClick={() => openProductModal(product)}
                                            >
                                                <FaEye />
                                            </button>
                                            <div className="p-3">

                                                <h5 className="home-product-title">

                                                    {product.name}

                                                </h5>

                                                {/* <div className="mb-2 text-warning">

                        ★★★★☆

                    </div> */}

                                                <h4 className="text-success fw-bold">

                                                    ₹{product.price.toLocaleString()}

                                                </h4>

                                                <small className="text-muted">

                                                    Stock : {product.stock}

                                                </small>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    );

                })

            }

            {selectedProduct && (
                <div className="product-details-modal" onClick={closeProductModal}>
                    <div className="product-details-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="btn-close product-details-modal-close"
                            aria-label="Close"
                            onClick={closeProductModal}
                        ></button>

                        <div className="row g-4 align-items-center">
                            <div className="col-md-5">
                                <img
                                    src={selectedProduct.imageUrl ? `${import.meta.env.VITE_BACKEND_URL}${selectedProduct.imageUrl}` : "https://placehold.co/300"}
                                    alt={selectedProduct.name}
                                    className="img-fluid rounded-3"
                                />
                            </div>

                            <div className="col-md-7">
                                <h3 className="fw-bold mb-3">{selectedProduct.name}</h3>
                                <p className="text-muted mb-3">
                                    {selectedProduct.description || "No description available for this product."}
                                </p>
                                <h4 className="text-success fw-bold mb-3">
                                    ₹{selectedProduct.price?.toLocaleString()}
                                </h4>
                                <p className="mb-2"><strong>Stock:</strong> {selectedProduct.stock}</p>
                                <p className="mb-4"><strong>Category ID:</strong> {selectedProduct.categoryId}</p>
                                <button className="btn btn-primary rounded-pill" onClick={closeProductModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );

}