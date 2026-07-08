import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import categoryService from "../service/category.service.js";
import defaultImg from "../assets/meeting.jpg";
import Header from "./Header.jsx";
import { toast } from "react-toastify";
import { FaArrowAltCircleUp, FaEllipsisV, FaPencilAlt, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { showDeleteConfirm } from "../utils/commonFunctions.js";
import '../assets/css/category.css';
import {
  createCategoryAPI,
  fetchAllCategoriesAPI,
  clearCategoryMessages,
  updateCategoryAPI,
} from "../features/category/categorySlice";

const CategoryCard = () => {
  const dispatch = useDispatch();
  const { items: categories, loading: isLoading, error: reduxError, successMessage } = useSelector((state) => state.category);
  const {token,role} = useSelector((state) => state.profile);
  console.log("Redux Categories:", categories," Loading:", isLoading, "Error:", reduxError, "Success:", successMessage);
  const [localCategories, setLocalCategories] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
const IMAGE_BASE_URL =
    "https://ekart-backend-production-bc50.up.railway.app";
  // Form state
  const [formData, setFormData] = useState({ name: "", description: "", imageUrl: null });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit mode
  const [editingCategory, setEditingCategory] = useState(null);

  const modalRef = useRef(null);

  useEffect(() => {
    if(isLoading){
       dispatch(fetchAllCategoriesAPI());
    }
   
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (Array.isArray(categories)) {
      setLocalCategories(categories);
    } else if (Array.isArray(categories?.data)) {
      setLocalCategories(categories.data);
    }
  }, [categories]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearCategoryMessages());
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
      toast.error(reduxError);
      dispatch(clearCategoryMessages());
    }
  }, [reduxError, dispatch]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Category name is required";
    if (formData.name.length > 50)
      errors.name = "Name must be under 50 characters";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (formData.imageUrl == null) {
      errors.imageUrl = "Category image is required";
    }
    console.log(errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
   
    e.preventDefault();
    if (!validateForm()) return;

    const formdata = new FormData();
    if (preview && formData.imageUrl != null) {
      formdata.append("imageUrl", formData.imageUrl);
    }
    formdata.append("name", formData.name);
    formdata.append("description", formData.description);

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const resultAction = await dispatch(updateCategoryAPI({ id: editingCategory.id, category: formdata, token }));
        if (updateCategoryAPI.fulfilled.match(resultAction)) {
          console.log("Category updated in Redux:", resultAction.payload);
        }
      } else {
        const resultAction = await dispatch(createCategoryAPI({ category: formdata, token }));
        if (createCategoryAPI.fulfilled.match(resultAction)) {
          console.log("Category created in Redux:", resultAction.payload);
        }
      }
      closeModal();
      dispatch(fetchAllCategoriesAPI());
    } catch (err) {
      setFormErrors({ submit: "Operation failed. Please try again." });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  // Handle delete
  const handleDelete = async (id) => {

    const confirmed = await showDeleteConfirm("Delete Category?", "You won't be able to recover it!", "warning");
    if (!confirmed) return;

    const toastId = toast.loading("Deleting...")
    try {
      const response = await categoryService.deleteCat(id, token);
      console.log("Delete Response:", response.data);

      await dispatch(fetchAllCategoriesAPI());

      toast.update(toastId, {
        render: response.data?.message || "Category deleted successfully",
        type: response.data?.code == 400 ? "error" : "success",
        autoClose: 3000,
        isLoading: false
      })

    } catch (err) {
      console.error("Delete Error:", err);

      toast.update(toastId, {
        render:
          err.response?.data?.message ||
          err.message ||
          "Oops! Failed to delete category",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true
      });
    };
  }

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



  // Modal helpers
  const openModal = (category = null) => {
    setEditingCategory(category);
    setFormErrors({});
    setPreview(null);
    setImage(null);
    setError(null);
    setFormData(
      category
        ? { name: category.name, description: category.description, imageUrl: category.imageUrl }
        : { name: "", description: "", imageUrl: null }
    );

  };

  const closeModal = () => {
    modalRef.current?.click();
    setEditingCategory(null);
    setFormData({ name: "", description: "", imageUrl: null });
    setFormErrors({});
    setPreview(null);
    setImage(null);
    setError(null);
  };

  // Filter and sort
  const filteredCategories = localCategories
    .filter(
      (cat) =>
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="d-flex flex-column flex-lg-row justify-content-between
             align-items-lg-center mb-4">

              <div>

                <h2 className="fw-bold mb-1">
                  📂 Category Management
                </h2>

                <p className="text-muted mb-0">
                  Create, update and organize product categories
                </p>

              </div>

              <div className="d-flex gap-2 mt-3 mt-lg-0">

                <button
                  className="btn btn-light border rounded-pill px-4"
                  onClick={fetchAllCategoriesAPI}
                >
                  🔄 Refresh
                </button>

                {role === "ADMIN" && (

                  <button
                    className="btn btn-success rounded-pill px-4 shadow-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#categoryModal"
                    onClick={() => openModal()}
                  >
                    <FaPlus className="me-2" />
                    Add Category
                  </button>

                )}

              </div>

            </div>

            <hr />

            {/* Search & Sort */}

            <div className="row g-3 align-items-center">

              {/* Search */}

              <div className="col-lg-6">

                <div className="input-group">

                  <span className="input-group-text py-2 ">
                    <FaSearch className="text-success" />
                  </span>

                  <input
                    type="search"
                    className="form-control border-start-0 py-2"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                </div>

              </div>

              {/* Sort */}

              <div className="col-lg-3">

                <select
                  className="py-2 px-3 rounded-2 w-100 border"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>

              </div>

              {/* Total Categories */}

              <div className="col-lg-3">

                <div className="bg-light rounded-3 text-center py-2">

                  <small className="text-muted d-block">
                    Total Categories
                  </small>

                  <h5 className="fw-bold text-success mb-0">
                    {filteredCategories.length}
                  </h5>

                </div>

              </div>

            </div>

          </div>

        </div>
        {/* Grid  */}
        {role === "ADMIN" &&
          <div className="row g-3 mb-4">

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body text-center">
                  <h6 className="text-muted">Total Categories</h6>
                  <h3 className="fw-bold text-success">
                    {localCategories.length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body text-center">
                  <h6 className="text-muted">Search Results</h6>
                  <h3 className="fw-bold text-primary">
                    {filteredCategories.length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body text-center">
                  <h6 className="text-muted">Last Updated</h6>
                  <h5 className="fw-bold ">
                    Today
                  </h5>
                </div>
              </div>
            </div>

          </div>
        }
        {/* Error state */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <span>{error}</span>
            <button
              className="btn btn-sm btn-outline-danger ms-auto"
              onClick={() => dispatch(fetchAllCategoriesAPI())}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filteredCategories.length === 0 && (
          <div className="text-center py-5">
            <i
              className="bi bi-folder2-open text-muted"
              style={{ fontSize: "4rem" }}
            ></i>
            <p className="mt-3 text-muted">
              {searchTerm
                ? "No categories match your search."
                : "No categories yet."}
            </p>
            {role === "ADMIN" && !searchTerm && (
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#categoryModal"
                onClick={() => openModal()}
              >
                Create your first category
              </button>
            )}
          </div>
        )}

        {/* Category grid */}
        {!isLoading && !error && filteredCategories.length > 0 && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {filteredCategories.map((category) => (
              <div className="col" key={category.id}>
                <article className="card h-100 shadow-sm hover-shadow transition-all">
                  <div className="position-relative">
                    <img
                      src={category.imageUrl != null ? `${import.meta.env.VITE_BACKEND_URL}${category.imageUrl}` : defaultImg}
                      alt={`${category.name} banner`}
                      className="card-img-top"
                      style={{ height: "160px", objectFit: "cover" }}
                      loading="lazy"
                    />
                    {role === "ADMIN" && (
                      <div className="position-absolute top-0 end-0 p-2">
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-warning rounded-circle shadow-sm"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            aria-label="Category options"
                          >
                            <FaEllipsisV className=""></FaEllipsisV>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#categoryModal"
                                onClick={() => openModal(category)}
                              >
                                <FaPencilAlt className=" me-2"></FaPencilAlt>Edit
                              </button>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(category.id)}
                              >
                                <FaTrash className=" me-2"></FaTrash>Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h2 className="card-title h5 mb-2">{category.name}</h2>
                    <p className="card-text text-muted small flex-grow-1">
                      {category.description.length > 100
                        ? `${category.description.slice(0, 100)}...`
                        : category.description}
                    </p>
                    <button className="btn btn-outline-primary btn-sm mt-2 align-self-start">
                      View Details
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}

        {/* Category count */}
        {!isLoading && filteredCategories.length > 0 && (
          <p className="text-muted small mt-4">
            Showing {filteredCategories.length} of {localCategories.length} categories
          </p>
        )}

        {/* Modal */}
        <div
          className="modal fade"
          id="categoryModal"
          tabIndex={-1}
          aria-labelledby="categoryModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="categoryModalLabel">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => closeModal()}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {formErrors.submit && (
                    <div className="alert alert-danger py-2">
                      {formErrors.submit}
                    </div>
                  )}

                  <div className="upload-container">
                    <input
                      type="file"
                      id="categoryImage"
                      hidden
                      className={`form-control ${formErrors.imageUrl ? "is-invalid" : ""}`}
                      accept="image/*"
                      onChange={(e) => handleImageChange(e)}
                    />

                    <label
                      htmlFor="categoryImage"
                      className="upload-box" >
                      {!preview ? (
                        formData.imageUrl == null ? (
                          <>
                            <FaArrowAltCircleUp className="fs-1"></FaArrowAltCircleUp>

                            <h5>Upload Category Image</h5>
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
                            src={`${import.meta.env.VITE_BACKEND_URL}${formData.imageUrl}`}
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
                    {formErrors.imageUrl && (
                      <div className="invalid-feedback">{formErrors.imageUrl}</div>
                    )}
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
                  <div className="mb-3">
                    <label htmlFor="catName" className="form-label">
                      Category Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="catName"
                      className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Enter category name"
                      maxLength={50}
                      autoFocus
                    />
                    {formErrors.name && (
                      <div className="invalid-feedback">{formErrors.name}</div>
                    )}
                    <div className="form-text">
                      {(formData.name || "").length}/50 characters
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="catDesc" className="form-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="catDesc"
                      rows={3}
                      className={`form-control ${formErrors.description ? "is-invalid" : ""}`}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Enter category description"
                    />
                    {formErrors.description && (
                      <div className="invalid-feedback">
                        {formErrors.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    ref={modalRef}
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
                    {isSubmitting && (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      />
                    )}
                    {editingCategory ? "Save Changes" : "Add Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
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
};

export default CategoryCard;