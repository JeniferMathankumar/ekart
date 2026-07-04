import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import ThemeToggle from "./ThemeToggle";

export default function CustomerHeader() {

    return (

        <nav className="
        navbar
        navbar-expand-lg
        shadow sticky-top">

            <div className="container">

                <NavLink
                    className="
                    navbar-brand
                    fw-bold"
                    to="/"
                >
                    🛒 E-Kart
                </NavLink>

                <button
                    className="navbar-toggler"
                    data-bs-toggle="collapse"
                    data-bs-target="#customerNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    id="customerNav"
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
                                to="/"
                            >
                                Home
                            </NavLink>
                        </li>

                        <li className="nav-item ">
                            <NavLink
                                to={'/category'}
                                className="nav-link">
                                Categories
                            </NavLink>

                            {/* <a
                                href="#"
                                className="
                                nav-link
                                dropdown-toggle"
                                data-bs-toggle="dropdown"
                            >
                                
                            </a> */}

                            {/* <ul className="dropdown-menu">

                                <li>
                                    <NavLink
                                        className="dropdown-item"
                                        to="/category/mobiles"
                                    >
                                        Mobiles
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        className="dropdown-item"
                                        to="/category/laptops"
                                    >
                                        Laptops
                                    </NavLink>
                                </li>

                            </ul> */}

                        </li>

                        <li className="nav-item dropdown">

                            {/* <a
                                href="#"
                                className="
                                nav-link
                                dropdown-toggle"
                                data-bs-toggle="dropdown"
                            >
                                Brands
                            </a>

                            <ul className="dropdown-menu">

                                <li>
                                    <NavLink
                                        className="dropdown-item"
                                        to="/brand/apple"
                                    >
                                        Apple
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        className="dropdown-item"
                                        to="/brand/samsung"
                                    >
                                        Samsung
                                    </NavLink>
                                </li>

                            </ul> */}

                              <NavLink
                                to={'/product'}
                                className="nav-link">
                                Products
                            </NavLink>


                        </li>

                    </ul>

                    {/* <SearchBar /> */}

                    <ul
                        className="
                        navbar-nav
                        align-items-center"
                    >

                        <li
                            className="
                            nav-item
                            position-relative"
                        >
                            <NavLink
                                className="nav-link"
                                to="/wishlist"
                            >
                                ❤️Wishlist
                            </NavLink>
                        </li>

                        <li
                            className="
                            nav-item
                            position-relative"
                        >
                            <NavLink
                                className="nav-link"
                                to="/cart"
                            >
                                🛒Cart
                            </NavLink>
                        </li>

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