// import { Link, NavLink } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import '../assets/css/header.css'
// import AdminHeader from "./AdminNavBar";
// import CustomerHeader from "./CustomerNavBar";
// import { useSelector } from "react-redux";

// export default function Header() {
//  const { name, email, role, profileimage, tokenExpiry, loading } = useSelector((state) => state.profile)
    

//     return role === "ADMIN"
//         ? <AdminHeader />
//         : <CustomerHeader />;

    
// }




import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import ThemeToggle from "./ThemeToggle";
import '../assets/css/header.css'

export default function Header() {

    const { role } = useSelector((state) => state.profile);
    const location = useLocation();
    const [isNavOpen, setIsNavOpen] = useState(false);

    useEffect(() => {
        setIsNavOpen(false);
    }, [location.pathname]);

    const toggleNavbar = () => {
        setIsNavOpen(prev => !prev);
    };

    const closeNavbar = () => {
        setIsNavOpen(false);
    };

    const adminMenus = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: "bi-speedometer2"
        },
        {
            name: "Categories",
            path: "/admin/category",
            icon: "bi-grid"
        },
        {
            name: "Products",
            path: "/admin/product",
            icon: "bi-box"
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: "bi-bag-check"
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: "bi-people"
        },
        {
            name: "Banners",
            path: "/admin/banner",
            icon: "bi-images"
        }
    ];

    const customerMenus = [
        {
            name: "Home",
            path: "/",
            icon: "bi-house"
        },
        {
            name: "Categories",
            path: "/category",
            icon: "bi-grid"
        },
        {
            name: "Products",
            path: "/product",
            icon: "bi-box"
        },
        {
            name: "Wishlist",
            path: "/wishlist",
            icon: "bi-heart"
        },
        {
            name: "Cart",
            path: "/cart",
            icon: "bi-cart3"
        }
    ];
     const guestMenus = [
        {
            name: "Home",
            path: "/",
            icon: "bi-house"
        },
        {
            name: "Categories",
            path: "/category",
            icon: "bi-grid"
        },
        {
            name: "Products",
            path: "/product",
            icon: "bi-box"
        }
    ];

    const menus = role === "ADMIN" ? adminMenus : role === "USER" ? customerMenus : guestMenus;

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top custom-navbar">

            <div className="container">

                <NavLink
                    className="navbar-brand fw-bold fs-4"
                    to={role === "ADMIN" ? "/admin/dashboard" : "/"}
                    onClick={closeNavbar}
                >
                    {role === "ADMIN"
                        ? (
                            <>
                                <i className="bi bi-shield-lock me-2"></i>
                                Admin Panel
                            </>
                        )
                        : (
                            <>
                                🛒 E-Kart
                            </>
                        )}
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleNavbar}
                    aria-expanded={isNavOpen}
                    aria-controls="navbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
                    id="navbar"
                >

                    <ul className="navbar-nav mx-auto">

                        {menus.map((menu) => (

                            <li
                                className="nav-item"
                                key={menu.path}
                            >
                                <NavLink
                                    to={menu.path}
                                    className="nav-link"
                                    onClick={closeNavbar}
                                >
                                    {menu.name}
                                </NavLink>
                            </li>

                        ))}

                    </ul>

                    <ul className="navbar-nav gap-2">

                        {role === "ADMIN" || role === "USER" &&
                          <NotificationDropdown />
                        }
                      
                        <UserDropdown />

                        <li className={`nav-item ${isNavOpen ? "hide" : ""}`}>
                            <ThemeToggle onClick={closeNavbar}/>
                        </li>

                    </ul>

                </div>

            </div>

        </nav>
    );
}