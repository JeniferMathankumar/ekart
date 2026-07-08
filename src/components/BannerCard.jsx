import { useEffect, useState } from "react";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteBannerByIdApi, fetAllBannersApi } from "../features/banner/bannerSlice";
import bannerService from "../service/banner.service";
import { showDeleteConfirm } from "../utils/commonFunctions";

export default function BannerCard() {

    const { token } = useSelector((state) => state.profile);
    const { items: banners, loading: isLoading, selectedBanner, successMessage } = useSelector(state => state.banner);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [localBanners, setLocalbanners] = useState([]);
    console.log("LOCALBANNER", localBanners);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // Form state
    const [formData, setFormData] = useState({ title: "", description: "", bannerImg: null });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingBannerId, setEditingBannerId] = useState(null);
const IMAGE_BASE_URL =
    "https://ekart-backend-production-bc50.up.railway.app";

    useEffect(() => {
        dispatch(fetAllBannersApi());
    }, [dispatch]);

    useEffect(() => {
        if (Array.isArray(banners)) {
            setLocalbanners(banners)
        } else if (Array.isArray(banners?.data)) {
            setLocalbanners(banners?.data);
        }
    }, [banners])
    console.log("BANNER", banners);
    const resetForm = () => {
        setFormData({ title: "", description: "", bannerImg: null });
        setImage(null);
        setPreview(null);
        setEditingBannerId(null);
        setFormErrors({});
    };
    // Form validation
    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = "Banner name is required";
        if (formData.title.length > 50)
            errors.title = "Banner Name must be under 50 characters";
        const hasExistingImage = Boolean(editingBannerId && formData.bannerImg && typeof formData.bannerImg === "string");
        const hasSelectedImage = Boolean(image);
        if (!hasExistingImage && !hasSelectedImage) {
            errors.bannerImg = "Banner image is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
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
            setFormData((prev) => ({ ...prev, bannerImg: file }));
            setPreview(URL.createObjectURL(file));
        }
    }


    useEffect(() => {
        const bannerToEdit = location.state?.bannerToEdit;
        if (bannerToEdit) {
            setEditingBannerId(bannerToEdit.id);
            setFormData({
                title: bannerToEdit.title || "",
                description: bannerToEdit.description || "",
                bannerImg: bannerToEdit.bannerImg || null,
            });
            setPreview(
                bannerToEdit.bannerImg
                    ? `${IMAGE_BASE_URL}${bannerToEdit.bannerImg}`
                    : null
            );
            setImage(null);
            setFormErrors({});
        }
    }, [location.state?.bannerToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const form = new FormData();

        form.append("title", formData.title);
        form.append("description", formData.description);

        if (image) {
            form.append("bannerImg", image);
        }

        setIsSubmitting(true);
        try {
            let response;
            if (editingBannerId) {
                response = await bannerService.updateBanner(form, editingBannerId, token);
                toast.success(response.data.message || "Banner Updated");
            } else {
                response = await bannerService.createBanner(form, token);
                toast.success(response.data.message || "Banner Added");
            }
            resetForm();
            navigate(-1);

        } catch (err) {
            setFormErrors({ submit: "Operation failed. Please try again." });
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    };
    // Handle delete
    const handleDelete = async (id) => {

        const confirmed = await showDeleteConfirm("Delete Banner?", "You won't be able to recover it!", "warning");
        if (!confirmed) return;

        const toastId = toast.loading("Deleting...")
        try {
            const response = await dispatch(deleteBannerByIdApi({id,token}));
        
            if(response){
            dispatch(fetAllBannersApi());
            }

            toast.update(toastId, {
                render: response.data?.message || "Banner deleted successfully",
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
                    "Oops! Failed to delete banner",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                closeButton: true
            });
        };
    }
    return (

        <div className="container">

            <div className="card p-4 shadow">

                <h3 className="mb-3">
                    {editingBannerId ? "Edit Banner" : "Banner Management"}
                </h3>

                <form onSubmit={handleSubmit}>
                    {formErrors.submit && (
                        <div className="alert alert-danger py-2">
                            {formErrors.submit}
                        </div>
                    )}
                    <div className="mb-3">
                        <input
                            type="text"
                            className={`form-control ${formErrors.title ? "is-invalid" : ""}`}
                            placeholder="Banner Title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, title: e.target.value }))
                            }
                        />
                        {formErrors.title && (
                            <div className="invalid-feedback">{formErrors.title}</div>
                        )}

                        <div className="form-text">
                            {formData.title.length}/50 characters
                        </div>
                    </div>
                    <div className="mb-3">
                        <textarea
                            className={`form-control ${formErrors.description ? "is-invalid" : ""}`}
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, description: e.target.value }))
                            }
                        />
                        {formErrors.description && (
                            <div className="invalid-feedback">{formErrors.description}</div>
                        )}
                    </div>

                    <div className="upload-container">
                        <input
                            type="file"
                            id="bannerImage"
                            hidden
                            className={`form-control ${formErrors.bannerImg ? "is-invalid" : ""}`}
                            accept="image/*"
                            onChange={(e) => handleImageChange(e)}
                        />

                        <label
                            htmlFor="bannerImage"
                            className="upload-box" >
                            {!preview ? (
                                formData.bannerImg == null ? (
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
                                        src={`${import.meta.env.VITE_BACKEND_URL}${formData.bannerImg}`}
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
                        {formErrors.bannerImg && (
                            <div className="invalid-feedback">{formErrors.bannerImg}</div>
                        )}
                        {
                            preview && (
                                <button
                                    type="button"
                                    className="btn btn-danger mt-2"
                                    onClick={() => {
                                        setImage(null);
                                        setFormData((prev) => ({ ...prev, bannerImg: null }));
                                        setPreview(null);
                                    }}
                                >
                                    Remove Image
                                </button>
                            )
                        }

                    </div>
                    <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-primary" disabled={isSubmitting}>
                            {editingBannerId ? "Update Banner" : "Upload Banner"}
                        </button>
                        {editingBannerId && (
                            <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                                Cancel Edit
                            </button>
                        )}
                    </div>

                </form>

            </div>
            {/* Error state */}
            {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <span>{error}</span>
                    <button
                        className="btn btn-sm btn-outline-danger ms-auto"
                        onClick={dispatch(fetAllBannersApi())}
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
            {/* BANNER GRID */}
            <div className="row mt-4">
                {!isLoading && !error && localBanners.length > 0 && (
                    localBanners.map(
                        (banner) => (
                            <div
                                className="col-md-4"
                                key={banner.id}
                            >

                                <div
                                    className="card shadow"
                                >

                                    <img
                                        src={
                                            `${IMAGE_BASE_URL}${banner.bannerImg}`
                                        }
                                        className="card-img-top"
                                        style={{
                                            height:
                                                "220px",
                                            objectFit:
                                                "cover"
                                        }}
                                        alt=""
                                    />

                                    <div
                                        className="card-body"
                                    >

                                        <h5>
                                            {banner.title}
                                        </h5>

                                        <p>
                                            {
                                                banner.description
                                            }
                                        </p>

                                        <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                                handleDelete(banner.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>
                        ))
                )}


            </div>

            <style>{`
                     .hover-shadow:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                      }
                     .transition-all {
                        transition: all 0.2s ease-in-out;
                     }
           `}</style>
        </div>
    );
}