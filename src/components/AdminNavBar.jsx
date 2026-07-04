import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import ThemeToggle from "./ThemeToggle";

export default function AdminHeader() {

    return (

        <nav className="
        navbar
        navbar-expand-lg
        sticky-top
        shadow">

            <div className="container">

                <NavLink
                    className="
                    navbar-brand
                    fw-bold"
                    to="/admin/dashboard"
                >
                    Admin Panel
                </NavLink>

                <button
                    className="navbar-toggler"
                    data-bs-toggle="collapse"
                    data-bs-target="#adminNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    id="adminNav"
                    className="
                    collapse
                    navbar-collapse"
                >

                    <ul
                        className="
                        navbar-nav
                        me-auto"
                    >

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/admin/dashboard"
                            >
                                Dashboard
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/admin/category"
                            >
                                Categories
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/admin/product"
                            >
                                Products
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/admin/orders"
                            >
                                Orders
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/admin/users"
                            >
                                Users
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/admin/banner"
                            >
                                Banners
                            </NavLink>
                        </li>

                    </ul>

                    {/* <SearchBar /> */}

                    <ul className="navbar-nav">

                        <NotificationDropdown />

                        <UserDropdown />
                        <li className="ms-2">
                            <ThemeToggle />
                        </li>
                    </ul>

                </div>

            </div>

        </nav>

    );
}