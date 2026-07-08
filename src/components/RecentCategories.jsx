import { useEffect, useState } from "react";
import categoryService from "../service/category.service";
import '../assets/css/dashboard.css'
import { FaFolderOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchAllCategoriesAPI } from "../features/category/categorySlice";

export default function RecentCategories() {
    const { items: categories, loading: isLoading, error: reduxError, successMessage } = useSelector((state) => state.category);
    const { token, role } = useSelector((state) => state.profile);
    console.log("Redux Categories:", categories, " Loading:", isLoading, "Error:", reduxError, "Success:", successMessage);
    const [localCategories, setLocalCategories] = useState([]);

    const [sortOrder, setSortOrder] = useState("newest");
    const navigate = useNavigate();
    const dispatch = useDispatch();
const IMAGE_BASE_URL =
    "https://ekart-backend-production-bc50.up.railway.app";

    // Fetch categories
    useEffect(()=>{
        dispatch(fetchAllCategoriesAPI());
    },[dispatch])

    useEffect(() => {
        if (Array.isArray(categories)) {
            setLocalCategories(categories);
        } else if (Array.isArray(categories?.data)) {
            setLocalCategories(categories.data);
        }
    }, [categories]);

    // Filter and sort
    const filteredCategories = [...localCategories]
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

    return (

        <div className="card border-0 shadow-lg rounded-4 mb-3">

            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">

                <div>
                    <h5 className="fw-bold mb-0">
                        <FaFolderOpen className="text-success me-2" />
                        Recent Categories
                    </h5>

                    <small className="text-muted">
                        Latest categories in your store
                    </small>
                </div>

                <button className="btn btn-outline-success btn-sm rounded-pill"
                    onClick={() => {
                        navigate("/admin/category")
                    }}>
                    View All
                </button>

            </div>

            <div className="table-responsive">

                <table className="table align-middle mb-0">

                    <thead className="table-light">

                        <tr>
                            <th>Category</th>
                            <th>Products</th>
                            <th>Status</th>
                            {/* <th className="text-center">Action</th> */}
                        </tr>

                    </thead>

                    <tbody>

                        {filteredCategories
                            .slice(0, 5)
                            .map((cat, index) => (

                                <tr key={cat.id || index}>

                                    <td>

                                        <div className="d-flex align-items-center">
                                            <img
                                                src={
                                                    cat.imageUrl
                                                        ? `${import.meta.env.VITE_BACKEND_URL}${cat.imageUrl}`
                                                        : "https://placehold.co/60x60"
                                                }
                                                alt={cat.name}
                                                className="rounded-circle border"
                                                style={{
                                                    width: "55px",
                                                    height: "55px",
                                                    objectFit: "cover"
                                                }}
                                            />


                                            <div className="ms-3">

                                                <h6 className="mb-1 fw-semibold">
                                                    {cat.name}
                                                </h6>

                                                <small className="text-muted">
                                                    ID #{cat.id}
                                                </small>

                                            </div>

                                        </div>

                                    </td>

                                    <td>
                                        
                                    <span className="badge bg-primary rounded-pill">
                                        {cat.productcount ?? 0} Products
                                    </span>

                                    </td>

                                    <td>

                                        <span className="badge bg-success-subtle text-success border border-success">
                                            Active
                                        </span>

                                    </td>

                                    {/* <td className="text-center">

                                <button className="btn btn-sm btn-light me-2">
                                    <FaEye />
                                </button>

                                <button className="btn btn-sm btn-light text-success">
                                    <FaEdit />
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