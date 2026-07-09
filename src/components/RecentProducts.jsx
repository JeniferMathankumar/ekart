import { useEffect, useState } from "react";
import productService from "../service/product.service";
import '../assets/css/dashboard.css'
import { FaBoxOpen, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProductsAPI } from "../features/product/productSlice";

export default function RecentProducts() {
    const {
        items: products,
        loading: productLoading,
        submitting,
        error: productError,
        successMessage,
        selectedProduct,
    } = useSelector((state) => state.product);
    console.log("Redux Recent Products:", products, "Loading:", productLoading, "Error:", productError, "Success:", successMessage, "Selected Product:", selectedProduct);
    const dispatch = useDispatch();
    const [localProducts, setLocalProducts] = useState([]);
    const [sortOrder, setSortOrder] = useState("newest");
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchAllProductsAPI());
    }, [dispatch]);


    useEffect(() => {
        if (Array.isArray(products)) {
            setLocalProducts(products);
        } else if (Array.isArray(products?.data)) {
            setLocalProducts(products.data);
        }
    }, [products]);
    // Filter and sort
    const filteredProducts = [...localProducts]
        .sort((a, b) => {
            switch (sortOrder) {
                case "name-desc":
                    return b.name.localeCompare(a.name);
                case "newest":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "oldest":
                    return new Date(a.createdAt) - new Date(b.createdAt);
                default:
                    return a.name.localeCompare(b.name);
            }
        });
    console.log("filteredProducts", filteredProducts)

    return (

        <div className="card border-0 shadow-lg rounded-4 mb-3">

            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">

                <div>
                    <h5 className="fw-bold mb-0">
                        <FaBoxOpen className="text-primary me-2" />
                        Recent Products
                    </h5>
                    <small className="text-muted">
                        Latest added products
                    </small>
                </div>

                <button className="btn btn-outline-primary btn-sm rounded-pill"
                    onClick={() => {
                        navigate('/admin/product')
                    }}>
                    View All
                </button>

            </div>

            <div className="table-responsive">

                <table className="table align-middle mb-0">

                    <thead className="table-light">

                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            {/* <th className="text-center">Action</th> */}
                        </tr>

                    </thead>

                    <tbody>

                        {filteredProducts
                            .slice(0, 5)
                            .map((product,index) => (

                                <tr key={product.id || index}>

                                    <td>

                                        <div className="d-flex align-items-center">

                                            <img
                                                src={
                                                    product.imageUrl
                                                        ? product.imageUrl
                                                        : "https://placehold.co/60x60"
                                                }
                                                alt={product.name}
                                                className="rounded-3 border"
                                                style={{
                                                    width: "55px",
                                                    height: "55px",
                                                    objectFit: "cover"
                                                }}
                                            />

                                            <div className="ms-3">

                                                <h6 className="mb-1 fw-semibold">
                                                    {product.name}
                                                </h6>

                                                <small className="text-muted">
                                                    ID #{product.id}
                                                </small>

                                            </div>

                                        </div>

                                    </td>

                                    <td className="fw-bold text-success">
                                        ₹{product.price.toLocaleString()}
                                    </td>

                                    <td>

                                        <span className="fw-semibold">
                                            {product.stock}
                                        </span>

                                    </td>

                                    <td>

                                        {product.stock > 10 ? (
                                            <span className="badge bg-success-subtle text-success border border-success">
                                                In Stock
                                            </span>
                                        ) : product.stock > 0 ? (
                                            <span className="badge bg-warning-subtle text-warning border border-warning">
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="badge bg-danger-subtle text-danger border border-danger">
                                                Out of Stock
                                            </span>
                                        )}

                                    </td>

                                    {/* <td className="text-center">

                                <button className="btn btn-sm btn-light me-2">
                                    <FaEye />
                                </button>

                                <button className="btn btn-sm btn-light text-primary">
                                    <FaEdit />
                                </button>
                                 <button className="btn btn-sm btn-light text-danger me-2">
                                    <FaTrash />
                                </button>

                            </td> */}

                                </tr>

                            ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}