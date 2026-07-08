import { useEffect, useState } from "react";
import { FaBoxOpen, FaList, FaImage } from "react-icons/fa";
import RecentProducts from "./RecentProducts";
import RecentCategories from "./RecentCategories";
import '../assets/css/dashboard.css'
import { useSelector } from "react-redux";
import Dashboard_banner from "./Dashboard_banner";

export default function Dashboard() {
    const {items: categories} = useSelector((state) => state.category);
    const {items: products} = useSelector((state) => state.product);
    const {items: banner, totalitem: bannerCount} = useSelector((state) => state.banner);
    const [dashboard, setDashboard] = useState({
        products: 0,
        categories: 0,
        banners: 0
    });

    useEffect(() => {

        // API Call

        setDashboard({
            products: products.length || 0,
            categories: categories.length || 0,
            banners: bannerCount || 0,
        });

    }, []);

    return (
        <div className="container-fluid">

            {/* <h2 className="mb-4 p-2 ">
                Dashboard
            </h2> */}

            <div className="row g-4 p-3">

                {/* PRODUCTS */}

                <div className="col-md-4">

                    <div className=" dashboard-card ">

                        <div>
                            <h5>Products</h5>
                            <h2>{dashboard.products}</h2>
                        </div>

                        <FaBoxOpen className="icon" size={40} />

                    </div>

                </div>

                {/* CATEGORIES */}

                <div className="col-md-4">

                    <div className=" dashboard-card">

                        <div>
                            <h5>Categories</h5>
                            <h2>{dashboard.categories}</h2>
                        </div>

                        <FaList className="icon" size={40} />

                    </div>

                </div>

                {/* BANNERS */}

                <div className="col-md-4">

                    <div className=" dashboard-card ">

                        <div>
                            <h5>Banners</h5>
                            <h2>{dashboard.banners}</h2>
                        </div>

                        <FaImage className="icon" size={40} />

                    </div>

                </div>

            </div>
            <Dashboard_banner/>

            <div className="row mt-4">

                <div className="col-lg-6">

                    <RecentProducts />

                </div>

                <div className="col-lg-6">

                    <RecentCategories />

                </div>

            </div>

        </div>
    );
}