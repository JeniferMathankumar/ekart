import { useEffect, useState } from "react";
import { FaEdit, FaFileImage, FaImages, FaPen, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetAllBannersApi } from "../features/banner/bannerSlice";
import { useNavigate } from "react-router-dom";
import { showDeleteConfirm } from "../utils/commonFunctions";

export default function Dashboard_banner() {

    const { items: banner, totalitem: bannerCount } = useSelector((state) => state.banner);
    const [localbanners, setLocalBanners] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(fetAllBannersApi());
    }, [dispatch]);

    useEffect(() => {
        if (Array.isArray(banner)) {
            setLocalBanners(banner);
        } else if (Array.isArray(banner?.data)) {
            setLocalBanners(banner.data);
        }
    }, [banner]);
    // Handle delete
    const handleDelete = async (id) => {

        const confirmed = await showDeleteConfirm("Delete Banner?", "You won't be able to recover it!", "warning");
        if (!confirmed) return;

        const toastId = toast.loading("Deleting...")
        try {
            const response = await dispatch(deleteBannerByIdApi({ id, token }));

            if (response) {
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
    console.log("BANNER", banner);
    return (
        <>
            <div className="card border-0 shadow-lg rounded-4 my-3">

                <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">

                    <div>
                        <h5 className="fw-bold mb-0">
                            <FaImages className="text-warning me-2" />
                            Banners
                        </h5>

                        <small className="text-muted">
                            Banner Management
                        </small>
                    </div>

                    <button className="btn btn-outline-warning btn-sm rounded-pill"
                        onClick={() => {
                            navigate("/admin/banner")
                        }}>
                        Add banner
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Banner </th>
                                <th>Banner Name</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localbanners
                                .map((ban, index) => (
                                    <tr key={ban.id || index}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={
                                                        ban.bannerImg
                                                            ? ban.bannerImg
                                                            : "https://placehold.co/60x60"
                                                    }
                                                    alt={ban.title}
                                                    className="rounded-2 border"
                                                    style={{
                                                        width: "170px",
                                                        height: "70px",
                                                        objectFit: "cover"
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td>

                                            <div className="ms-3">

                                                <h6 className="mb-1 fw-semibold">
                                                    {ban.title}
                                                </h6>

                                                <small className="text-muted">
                                                    ID #{ban.id}
                                                </small>

                                            </div>
                                        </td>
                                        <td>

                                            <span className="badge bg-success-subtle text-success border border-success">
                                                Active
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-light me-2"
                                                onClick={() => navigate("/admin/banner", { state: { bannerToEdit: ban } })}
                                            >
                                                <FaPen className="text-primary" size={15}></FaPen>
                                            </button>
                                            <button type="button"
                                                className="btn btn-sm btn-light me-2"
                                               onClick={() => handleDelete(ban.id)}>
                                                <FaTrash className="text-danger" size={15}></FaTrash>
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}