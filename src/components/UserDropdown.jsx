import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function UserDropdown() {
    const { name, email, role, profileimage, tokenExpiry, loading } = useSelector((state) => state.profile)

    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    // const userInfo =
    //     JSON.parse(
    //         localStorage.getItem(
    //             "userInfo"
    //         ) || sessionStorage.getItem("userInfo")
    //     );


    return (

        <li className="nav-item dropdown">
            <a
                href="#"
                className="
                nav-link
                dropdown-toggle"
                data-bs-toggle="dropdown"
            >
                👤 {!!name ? name : "Guest"}
            </a>

            <ul className="dropdown-menu dropdown-menu-end">
                {name &&
                    < li >
                        <NavLink
                            className="dropdown-item"
                            to="/profile"
                        >
                            Profile
                        </NavLink>
                    </li>
                }{role === 'USER' &&
                    <li>
                        <NavLink
                            className="dropdown-item"
                            to="/orders"
                        >
                            Orders
                        </NavLink>
                    </li>
                }{role === 'USER' &&
                    <li>
                        <NavLink
                            className="dropdown-item"
                            to="/address"
                        >
                            Addresses
                        </NavLink>
                    </li>
                }
                {name &&
                    <li>
                        <hr className="dropdown-divider" />
                    </li>
                }

                <li>
                    {name ?
                        <button
                            className="
                               dropdown-item
                               text-danger"
                            onClick={logout}
                        >
                            Logout
                        </button>
                        :
                        <button
                            className="
                               dropdown-item
                               text-primary"
                            onClick={() => {
                                navigate("/auth/login")
                            }}
                        >
                            Login
                        </button>

                    }
                </li>

            </ul >

        </li >

    );
}