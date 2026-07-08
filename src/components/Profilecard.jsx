import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import '../assets/css/profile.css'
import {
    FaUserCircle,
    FaEnvelope,
    FaUserTag,
    FaEdit,
    FaSave
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { updateProfileAPI } from "../features/profile/profileSlice";

const Profilecard = () => {
    const dispatch = useDispatch();
    const { name: profileName, email: profileEmail, role: profileRole, profileimage, token, loading } = useSelector((state) => state.profile);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [image, setImage] = useState("");
    const [previewimage, setPreviewImage] = useState("");
    const [proimage, setProImage] = useState(null);

    const [errormsg, setErrorMsg] = useState({});
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
const IMAGE_BASE_URL =
    "https://ekart-backend-production-bc50.up.railway.app";

    useEffect(() => {
        if (profileName || profileEmail || profileRole || profileimage) {
            setName(profileName || "");
            setEmail(profileEmail || "");
            setRole(profileRole || "");
            setImage(profileimage || "");
        } else {
            navigate('/');
        }
    }, [profileName, profileEmail, profileRole, profileimage, navigate]);

    const handleImageContent = (e) => {
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
            setProImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setErrorMsg({});
        if (!name) {
            setErrorMsg(prev => ({ ...prev, "name": "Name is required" }));
            return;
        }
        const toastId = toast.loading("Updating...");
        const formdata = new FormData();

        formdata.append("name", name);
        formdata.append("email", email);
        if (proimage) {
            formdata.append("imageUrl", proimage);
        }

        const result = await dispatch(updateProfileAPI({ formData: formdata, token }));

        if (updateProfileAPI.fulfilled.match(result)) {
            toast.update(toastId, {
                render: result.payload?.message || "Profile updated successfully",
                type: "success",
                autoClose: 3000,
                isLoading: false
            });
            setEditMode(false);
        } else {
            toast.update(toastId, {
                render: result.payload || result.error?.message || "Failed to update profile",
                type: "error",
                autoClose: 3000,
                isLoading: false
            });
        }

        // await userService.profileUpdate(formdata, token)
        //     .then(response => {
        //         console.log(response.data);
        //         const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        //         userInfo.username = response.data?.data?.name
        //         userInfo.profileImage = response.data?.data?.imageUrl

        //         localStorage.setItem("userInfo", JSON.stringify(userInfo));

        //         toast.update(toastId, {
        //             render: response.data?.message || "Profile updated successfully",
        //             type: "success",
        //             autoClose: 3000,
        //             isLoading: false
        //         });
        //         navigate(0)

        //     }).catch(err => {
        //         console.log("Update Error:", err);

        //         toast.update(toastId, {
        //             render:
        //                 err.response?.data?.message ||
        //                 err.message ||
        //                 "Failed to update profile",
        //             type: "error",
        //             isLoading: false,
        //             autoClose: 3000,
        //             closeButton: true
        //         });
        //     })

        setEditMode(false);
    };

    return (
        <>

            <div className="profile-page">

                <div className="profile-card">

                    {/* Avatar */}

                    <div className="text-center">
                        <div className="avatar">
                            
                            {image ? (
                                <img
                                    className="avatar"
                                    src={`${import.meta.env.VITE_BACKEND_URL}${image}`}
                                    alt="Preview"
                                    width="200"
                                />
                            )
                                :
                                name?.charAt(0)?.toUpperCase()
                            }
                        </div>
                        <h3 className="mt-3">
                            {name}
                        </h3>

                        <span
                            className={`badge ${role === "ADMIN"
                                ? "bg-danger"
                                : "bg-primary"
                                }`}
                        >
                            {role}
                        </span>

                    </div>

                    <hr />

                    {/* Image  */}
                    <div className="mb-3 d-flex ">
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control"

                            disabled={!editMode}
                            onChange={handleImageContent}>

                        </input>
                        { previewimage && (
                                <img
                                    className="rounded shadow shadow-1 m-auto ms-1 text-center bg-light"
                                    src={previewimage}
                                    alt="Preview"
                                    width="40"
                                    height="40"
                                />
                            )
                            } 
                    </div>
                    {/* Name */}
                    <div className="mb-3">

                        <label className="form-label fw-bold">

                            <FaUserCircle />
                            &nbsp; Username

                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            disabled={!editMode}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                        />
                        {errormsg.name &&
                            <div className="invalid-feedback">
                                {errormsg.name}</div>}
                    </div>

                    {/* Email */}

                    <div className="mb-3">

                        <label className="form-label fw-bold">

                            <FaEnvelope />
                            &nbsp; Email

                        </label>

                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            disabled
                        />

                    </div>

                    {/* Role */}

                    <div className="mb-4">

                        <label className="form-label fw-bold">

                            <FaUserTag />
                            &nbsp; Role

                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={role}
                            disabled
                        />

                    </div>

                    {/* Buttons */}

                    <div className="d-flex gap-2">

                        {
                            !editMode ? (

                                <button
                                    className="btn btn-primary w-100"
                                    onClick={() =>
                                        setEditMode(true)
                                    }
                                >
                                    <FaEdit />
                                    &nbsp; Edit Profile
                                </button>

                            ) : (

                                <button
                                    className="btn btn-success w-100"
                                    onClick={(e) => handleUpdate(e)}
                                >
                                    <FaSave />
                                    &nbsp; Save Changes
                                </button>

                            )
                        }

                    </div>

                </div>

            </div >
        </>
    );
};

export default Profilecard;