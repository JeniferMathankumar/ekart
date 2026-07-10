
import { useEffect, useRef, useState } from "react";
import categoryService from "../service/category.service";
import Header from "./Header";
import { FaArrowAltCircleUp, FaPencilAlt, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { showDeleteConfirm } from "../utils/commonFunctions";
import '../assets/css/product.css'
import { fetchAllCategoriesAPI } from "../features/category/categorySlice";
import {
    createProductAPI,
    deleteProductAPI,
    fetchAllProductsAPI,
    fetchProductByIdAPI,
    updateProductAPI,
    clearProductMessages,
} from "../features/product/productSlice";
import { useSelector, useDispatch } from 'react-redux';

const Productcard = () => {
    const { token, role } = useSelector((state) => state.profile);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // New state to track if we are editing a specific product
    const [editingProductId, setEditingProductId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [formData, setFormData] = useState({ categoryId: "", prodname: "", proddesc: "", prodprice: "", prodstock: "", imageUrl: null });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errors, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("name-asc");
    const cancelModalRef = useRef(null);

    const { items: categoryItems, loading: categoryLoading, error: categoryError } = useSelector((state) => state.category);
    const {
        items: products,
        loading: productLoading,
        submitting,
        error: productError,
        successMessage,
        selectedProduct,
    } = useSelector((state) => state.product);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllCategoriesAPI());
    }, [dispatch]);

    useEffect(() => {
        if (Array.isArray(categoryItems?.data)) {
            setCategories(categoryItems.data);
        } else if (Array.isArray(categoryItems)) {
            setCategories(categoryItems);
        }
    }, [categoryItems]);

    useEffect(() => {
        dispatch(fetchAllProductsAPI());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearProductMessages());
        }
    }, [successMessage, dispatch]);

    useEffect(() => {
        if (productError) {
            toast.error(productError);
            dispatch(clearProductMessages());
        }
    }, [productError, dispatch]);

    useEffect(() => {
        setIsLoading(productLoading || categoryLoading);
    }, [productLoading, categoryLoading]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, PNG, WEBP allowed");
            return;
        }
        const maxSize = 2 * 1024 * 1024;

        if (file.size > maxSize) {
            alert("Image size should be less than 2MB");
            return;
        }
        if (file) {
            setError(null);
            setImage(file);
            formData.imageUrl = file;
            setPreview(URL.createObjectURL(file));
        }
    }
    //Form validation
    const validateForm = () => {
        const errors = {};
        if (!formData.categoryId) errors.categoryId = "Category ID is required";
        if (!formData.prodname.trim()) errors.prodname = "Product name is required";
        if (formData.prodname.length > 50)
            errors.prodname = "Name must be under 50 characters";
        if (!formData.proddesc.trim())
            errors.proddesc = "Description is required";
        if (!formData.prodprice)
            errors.prodprice = "Price is required";
        if (formData.prodprice <= 0)
            errors.prodprice = "Price should be greater than or equal to 0"
        if (!formData.prodstock)
            errors.prodstock = "Stock is required";
        if (formData.prodstock <= 0)
            errors.prodstock = "Stock must be positive value"

        // if (formData.imageUrl == null) {
        //     errors.imageUrl = "Category image is required";
        // }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleClick = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        setIsSubmitting(true);

        const form = new FormData();
        form.append("categoryId", formData.categoryId);
        form.append("name", formData.prodname);
        form.append("description", formData.proddesc);
        form.append("price", formData.prodprice);
        form.append("stock", formData.prodstock);
        if (image != null) {
            form.append("imageUrl", formData.imageUrl);
        }
        try {
            if (editingProductId) {
                await dispatch(updateProductAPI({ id: editingProductId, form, token })).unwrap();
            } else {
                await dispatch(createProductAPI({ form, token })).unwrap();
            }

            closeModal();
        } catch (err) {
            setFormErrors({ submit: err || "Operation failed. Please try again." });
            // console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = await showDeleteConfirm("Delete Product?", "You won't be able to recover it!", "warning");
        if (!confirmed) return;

        const toastId = toast.loading("Deleting...");

        try {
            await dispatch(deleteProductAPI({ id, token })).unwrap();
            toast.update(toastId, {
                render: "Product deleted successfully",
                type: "success",
                autoClose: 3000,
                isLoading: false,
            });
        } catch (err) {
            toast.update(toastId, {
                render: err || "Failed to delete product",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                closeButton: true,
            });
        }
    };
    const openModal = async (product = null) => {
        setFormErrors({});
        setPreview(null);
        setImage(null);
        setError(null);
        if (product != null) {
            setEditingProductId(product.id);
            await dispatch(fetchProductByIdAPI(product.id));
        } else {
            setEditingProductId(null);
        }

        setFormData(
            product
                ? {
                    categoryId: product.categoryId,
                    prodname: product.name,
                    proddesc: product.description,
                    prodprice: product.price,
                    prodstock: product.stock,
                    imageUrl: product.imageUrl
                }
                : { categoryId: "", prodname: "", proddesc: "", prodprice: "", prodstock: "", imageUrl: null }
        );
        setFormErrors({});
    };
    const closeModal = () => {
        setFormErrors({});
        setPreview(null);
        setImage(null);
        setError(null);
        cancelModalRef.current?.click();
        setEditingProductId(null);
        setFormData({ categoryId: "", prodname: "", proddesc: "", prodprice: "", prodstock: "", imageUrl: null });
    };


    // Filter and sort
    const filteredProducts = products

        .filter(
            (pro) => {
                const matchSearch = pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pro.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pro.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
                const matchCategory = selectedCategory === "" ||
                    pro.categoryName === selectedCategory;
                return matchSearch && matchCategory;
            }
        )
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
        <>
            <main className="container py-4 m-5 mx-auto">
                {/* Toolbar */}
                <div className="card border-0 shadow-lg rounded-4 mb-4">

                    <div className="card-body p-4">

                        {/* Header */}

                        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4">

                            <div>

                                <h2 className="fw-bold mb-1 ">
                                    📦 Product Management
                                </h2>

                                <p className="text-muted mb-0">
                                    Manage, search and organize your store products
                                </p>

                            </div>

                            <div className="d-flex gap-2 mt-3 mt-lg-0">

                                <button
                                    className="btn btn-light border rounded-pill px-4"
                                    onClick={() => dispatch(fetchAllProductsAPI())}
                                >

                                    🔄 Refresh
                                </button>

                                {role === "ADMIN" && (

                                    <button
                                        className="btn btn-primary rounded-pill px-4 shadow-sm"
                                        data-bs-toggle="modal"
                                        data-bs-target="#openModal"
                                        onClick={()=>openModal()}
                                    >
                                        <FaPlus className="me-2" />
                                        Add Product
                                    </button>

                                )}

                            </div>

                        </div>

                        <hr />

                        {/* Search Section */}

                        <div className="row g-3 align-items-center">

                            {/* Search */}

                            <div className="col-lg-5">

                                <div className="input-group search-box">

                                    <span className="input-group-text bg-white border-end-0">

                                        <FaSearch className="text-primary" />

                                    </span>

                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Search by name, brand..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />

                                </div>

                            </div>

                            {/* Category */}

                            <div className="col-lg-3">

                                <select
                                    className="form-select rounded-3"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >

                                    <option value="">All Categories</option>

                                    {
                                        categories.map(cat => (
                                            <option
                                                key={cat.id}
                                                value={cat.name}
                                            >
                                                {cat.name}
                                            </option>
                                        ))
                                    }

                                </select>

                            </div>

                            {/* Sort */}

                            <div className="col-lg-2">

                                <select
                                    className="form-select rounded-3"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >

                                    <option value="name-asc">A-Z</option>
                                    <option value="name-desc">Z-A</option>
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>

                                </select>

                            </div>

                            {/* Total */}

                            <div className="col-lg-2">

                                <div className="bg-light rounded-3 text-center py-2">

                                    <small className="text-muted d-block">

                                        Total Products

                                    </small>

                                    <h5 className="fw-bold text-primary mb-0">

                                        {filteredProducts.length}

                                    </h5>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Error state */}
                {errors && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <span>{errors}</span>
                        <button
                            className="btn btn-sm btn-outline-danger ms-auto"
                            onClick={fetchProducts}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Loading state */}
                {(isLoading || submitting) && (
                    <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}


                {/* Product Grid */}
                {role === "ADMIN" &&
                    <div className="row mb-4">

                        <div className="col-md-3">

                            <div className="card shadow border-0 rounded-4">

                                <div className="card-body">

                                    <h6>Total Products</h6>

                                    <h2>{products.length}</h2>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-3">

                            <div className="card shadow border-0 rounded-4">

                                <div className="card-body">

                                    <h6>In Stock</h6>

                                    <h2 className="text-success">

                                        {products.filter(p => p.stock > 10).length}

                                    </h2>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-3">

                            <div className="card shadow border-0 rounded-4">

                                <div className="card-body">

                                    <h6>Low Stock</h6>

                                    <h2 className="text-warning">

                                        {products.filter(p => p.stock <= 10 && p.stock > 0).length}

                                    </h2>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-3">

                            <div className="card shadow border-0 rounded-4">

                                <div className="card-body">

                                    <h6>Out Of Stock</h6>

                                    <h2 className="text-danger">

                                        {products.filter(p => p.stock === 0).length}

                                    </h2>

                                </div>

                            </div>

                        </div>

                    </div>
                }

                {!isLoading && !errors && filteredProducts.length > 0 && (

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Stock</th>
                                {
                                    role === 'ADMIN' && (
                                        <th>Actions</th>
                                    )
                                }
                            </tr>
                        </thead>
                        {/* FIX: Moved tbody outside the map */}
                        <tbody>
                            {filteredProducts.map((product) => (
                                // FIX: Added key prop
                                <tr key={product.id} className="w-100">
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
                                    <td>{product.description}</td>
                                    <td className="fw-bold text-success">
                                        ₹{product.price.toLocaleString()}
                                    </td>
                                    <td>
                                        {
                                            product.stock > 10 ?

                                                <span className="badge bg-success">

                                                    In Stock

                                                    ({product.stock})

                                                </span>

                                                :

                                                product.stock > 0 ?

                                                    <span className="badge bg-warning ">

                                                        Low Stock

                                                        ({product.stock})

                                                    </span>

                                                    :

                                                    <span className="badge bg-danger">

                                                        Out of Stock

                                                    </span>

                                        }
                                    </td>
                                    {
                                        role === 'ADMIN' && (
                                            <td>
                                                {/* FIX: Changed onClick to arrow function */}
                                                <button className="btn btn-light me-2"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#openModal"
                                                    onClick={() => openModal(product)}>

                                                    <FaPencilAlt className="text-primary" />

                                                </button>
                                                <button className="btn btn-light"
                                                    onClick={() => handleDelete(product.id)}>

                                                    <FaTrash className="text-danger" />

                                                </button>
                                            </td>
                                        )
                                    }

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
                }
                {/* Empty state */}
                {!isLoading && !errors && filteredProducts.length === 0 && (
                    <div className="text-center py-5">
                        <i
                            className="bi bi-folder2-open text-muted"
                            style={{ fontSize: "4rem" }}
                        ></i>
                        <p className="mt-3 text-muted">
                            {searchTerm
                                ? "No products match your search."
                                : "No products yet."}
                        </p>
                        {role === "ADMIN" && !searchTerm && (
                            <button
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#openModal"
                                onClick={() => openModal()}
                            >
                                Create your first product
                            </button>
                        )}
                    </div>
                )}
                {/* Product count */}
                {!isLoading && filteredProducts.length > 0 && (
                    <p className="text-muted small mt-4">
                        Showing {filteredProducts.length} of {products.length} products
                    </p>
                )}

                {/* OPEN MODAL FOR ADD/EDIT PRODUCT */}
                <div
                    className="modal fade"
                    tabIndex={-1}
                    aria-hidden="true"
                    id="openModal"
                    aria-labelledby="productmodallabel">

                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="productmodallabel">
                                    {editingProductId ? "Edit Product" : "Add Product"}
                                </h5>
                                <button type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={closeModal}></button>
                            </div>
                            <form className="form w-100" onSubmit={handleClick}>
                                <div className="modal-body">
                                    {formErrors.submit && (
                                        <div className="alert alert-danger py-2">
                                            {formErrors.submit}
                                        </div>

                                    )}
                                    <div className="upload-container">
                                        <input
                                            type="file"
                                            id="proImage"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e)}
                                        />

                                        <label
                                            htmlFor="proImage"
                                            className="upload-box" >
                                            {!preview ? (
                                                formData.imageUrl == null ? (
                                                    <>
                                                        <FaArrowAltCircleUp className="fs-1"></FaArrowAltCircleUp>

                                                        <h5>Upload Product Image</h5>
                                                        <p>
                                                            Drag & Drop or Click to Upload
                                                        </p>

                                                        <small>
                                                            JPG, PNG, WEBP (Max 2MB)
                                                        </small>
                                                    </>
                                                )
                                                    :
                                                    <img
                                                        src={formData.imageUrl}
                                                        alt="image"
                                                        className="preview-image"
                                                    />

                                            ) : (
                                                <img
                                                    src={preview}
                                                    alt="preview"
                                                    className="preview-image"
                                                />
                                            )}
                                        </label>
                                        {/* {formErrors.imageUrl && (
                                            <div className="invalid-feedback">{formErrors.imageUrl}</div>
                                        )} */}
                                        {
                                            preview && (
                                                <button
                                                    type="button"
                                                    className="btn btn-danger mt-2"
                                                    onClick={() => {
                                                        setImage(null);
                                                        formData.imageUrl = null;
                                                        setPreview(null);
                                                    }}
                                                >
                                                    Remove Image
                                                </button>
                                            )
                                        }

                                    </div>
                                    <div>
                                        <label className="form-label mt-3">Category Name: </label>
                                        <select
                                            className={`form-select ${formErrors.categoryId ? "is-invalid" : ""}`}
                                            value={formData.categoryId}
                                            onChange={(e) => {
                                                setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                                            }}
                                        >
                                            <option value=''>--Select option--</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                        {formErrors.categoryId && (
                                            <div className="invalid-feedback">{formErrors.categoryId}</div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="prodName" className="form-label">Product Name: </label>
                                        <input
                                            id="prodName"
                                            className={`form-control ${formErrors.prodname ? "is-invalid" : ""}`}
                                            type="text"
                                            placeholder="Enter product name"
                                            value={formData.prodname}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, prodname: e.target.value }))
                                            }
                                            maxLength={50}
                                        />
                                        {formErrors.prodname && (
                                            <div className="invalid-feedback">{formErrors.prodname}</div>
                                        )}
                                        {
                                            formData.prodname &&
                                            <div className="form-text">
                                                {formData.prodname.length}/50 characters
                                            </div>
                                        }

                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="prodDesc" className="form-label">Product Description: </label>
                                        <textarea
                                            id="prodDesc"
                                            rows={3}
                                            className={`form-control ${formErrors.proddesc ? "is-invalid" : ""}`}
                                            placeholder="Enter product description"
                                            value={formData.proddesc}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, proddesc: e.target.value }))
                                            }
                                        />
                                        {formErrors.proddesc && (
                                            <div className="invalid-feedback">{formErrors.proddesc}</div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="prodPrice" className="form-label">Product Price: </label>
                                        <input
                                            id="prodPrice"
                                            className={`form-control ${formErrors.prodprice ? "is-invalid" : ""}`}
                                            type="number"
                                            placeholder="Enter product price"
                                            value={formData.prodprice}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, prodprice: e.target.value }))
                                            }
                                        />
                                        {formErrors.prodprice && (
                                            <div className="invalid-feedback">{formErrors.prodprice}</div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="prodStock" className="form-label">Product Stock: </label>
                                        <input
                                            id="prodStock"
                                            className={`form-control ${formErrors.prodstock ? "is-invalid" : ""}`}
                                            type="number"
                                            placeholder="Enter product stock"
                                            value={formData.prodstock}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, prodstock: e.target.value }))
                                            }
                                        />
                                        {formErrors.prodstock && (
                                            <div className="invalid-feedback">{formErrors.prodstock}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        ref={cancelModalRef}
                                        className="btn btn-secondary"
                                        data-bs-dismiss="modal"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary d-flex align-items-center gap-2"
                                        disabled={isSubmitting}
                                    >
                                        {(isSubmitting || submitting) && (
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                            />
                                        )}
                                        {editingProductId ? "Save Changes" : "Add Product"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main >
            <style>{`
             .hover-shadow:hover {
              transform: translateY(-2px);
              box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
             }
             .transition-all {
             transition: all 0.2s ease-in-out;
             }
           `}</style>
        </>
    );
}

export default Productcard;