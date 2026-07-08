import { useEffect, useState } from "react";
import bannerService from "../service/banner.service";
import { toast } from "react-toastify";
import { FaArrowAltCircleUp } from "react-icons/fa";

export default function BannerCard() {

    const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [banners, setBanners] =
        useState([]);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // Form state
    const [formData, setFormData] = useState({ title: "", description: "", bannerImg: null });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchBanners = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await bannerService
                .getBanners();
            setBanners(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    // Form validation
    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = "Banner name is required";
        if (formData.title.length > 50)
            errors.title = "Banner Name must be under 50 characters";
        // if (!formData.description.trim())
        //     errors.description = "Banner Description is required";
        if (formData.bannerImg == null) {
            errors.bannerImg = "Banner image is required";
        }
        console.log(errors);
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
            formData.bannerImg = file;
            setPreview(URL.createObjectURL(file));
        }
    }


    useEffect(() => {

        fetchBanners();

    }, []);

    const handleSubmit = async (e) => {


        const formdata = new FormData();


        e.preventDefault();
        if (!validateForm()) return;
        const form =
            new FormData();

        form.append(
            "title",
            formData.title
        );

        form.append(
            "description",
            formData.description
        );

        if (preview && formData.bannerImg != null) {
            form.append("bannerImg", formData.bannerImg);
        }
        setIsSubmitting(true);
        console.log("FORM",formData);
        try {

            const response =
                await bannerService
                    .createBanner(
                        form,
                        token
                    );

            toast.success(
                response.data.message ||
                "Banner Added"
            );

            fetchBanners();
            setFormData({title:"",description:"",bannerImg:null})
            setImage(null);
            setPreview(null);

        } catch (err) {
            setFormErrors({ submit: "Operation failed. Please try again." });
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {

        try {

            await bannerService
                .deleteBanner(
                    id,
                    token
                );

            toast.success(
                "Banner Deleted"
            );

            fetchBanners();

        } catch (error) {

            toast.error(
                error.response?.data?.message
            );
        }
    };

    return (

        <div className="container">

            <div className="card p-4 shadow">

                <h3 className="mb-3">
                    Banner Management
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
                                        src={`http://localhost:8080${formData.bannerImg}`}
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
                                        formData.bannerImg = null;
                                        setPreview(null);
                                    }}
                                >
                                    Remove Image
                                </button>
                            )
                        }

                    </div>
                    <button
                        className="btn btn-primary m-2"
                    >
                        Upload Banner
                    </button>

                </form>

            </div>
            {/* Error state */}
            {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <span>{error}</span>
                    <button
                        className="btn btn-sm btn-outline-danger ms-auto"
                        onClick={fetchCategories}
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
                {!isLoading && !error && banners.length > 0 && (
                    banners.map(
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
                                            `http://localhost:8080${banner.bannerImg}`
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
                                                handleDelete(
                                                    banner.id
                                                )
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

            {/* Category count */}
            {!isLoading && banners.length > 0 && (
                <p className="text-muted small mt-4">
                    Showing {banners.length} of {banners.length} categories
                </p>
            )}

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