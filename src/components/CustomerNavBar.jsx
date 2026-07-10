import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import ThemeToggle from "./ThemeToggle";

export default function CustomerHeader() {
    const {  role, profileimage } = useSelector((state) => state.profile)
// console.log("ROLEEEEE",role);
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
                        </li>

                        <li className="nav-item dropdown">

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
                        { role === "USER" &&
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
                        }
                        { role === "USER" &&

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
                        }

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