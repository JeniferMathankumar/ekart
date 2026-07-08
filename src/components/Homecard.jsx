import { useEffect, useState } from "react";
import Imagecarousel from "./Imagecarousel";
import { useDispatch } from "react-redux";
import { fetchAllCategoriesAPI } from "../features/category/categorySlice";
import RecentProducts from "./RecentProducts";
import HomeCategories from "./HomeCategories";
import HomeProducts from "./HomeProducts";

export default function Homecard() {
    const dispatch = useDispatch();
    // Fetch posts when component mounts
    useEffect(() => {
        dispatch(fetchAllCategoriesAPI());
    }, [dispatch]);
    return (
        <>
           
            <div className="container m-5 mx-auto">
                <Imagecarousel />
                <HomeCategories/>
                <HomeProducts/>
            </div>
        </>
    );
}