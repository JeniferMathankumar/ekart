import {
    FaTachometerAlt,
    FaBoxOpen,
    FaList,
    FaImage
} from "react-icons/fa";

export default function AdminSidebar() {

    return (

        <div className="sidebar">

            <h4 className="p-3">
                Admin Panel
            </h4>

            <ul>

                <li>
                    <a href="/admin/dashboard">
                        <FaTachometerAlt />
                        Dashboard
                    </a>
                </li>

                <li>
                    <a href="/admin/category">
                        <FaList />
                        Categories
                    </a>
                </li>

                <li>
                    <a href="/admin/product">
                        <FaBoxOpen />
                        Products
                    </a>
                </li>

                <li>
                    <a href="/admin/banner">
                        <FaImage />
                        Banners
                    </a>
                </li>

            </ul>

        </div>
    );
}