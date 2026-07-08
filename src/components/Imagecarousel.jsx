
import { useEffect, useRef, useState } from "react";
import userService from "../service/user.service.js"
import '../assets/css/imagecarousel.css'
import { Carousel } from "bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Imagecarousel = () => {
 const {token, role} = useSelector((state) => state.profile);
    const [images, setImages] = useState([]);
    const carouselRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!carouselRef.current || images.length === 0) return;

        const carousel = new Carousel(carouselRef.current, {
            interval: 3000,
            ride: "carousel",
            wrap: true
        });

        return () => carousel.dispose();
    }, [images]);

    useEffect(() => {
        userService.banners()
            .then(response => {
                setImages(response.data.data)
            }).catch(error => {
                console.log(error);
            });

    }, [])


    return (
        <>
            {images.length > 0 && (
                <div
                    ref={carouselRef}
                    id="bannercarousel"
                    className="carousel slide carousel-fade shadow-lg"
                    data-bs-ride="carousel"
                    data-bs-interval="3000"
                    style={{ zIndex: '1' }}
                >
                    {/* Indicators */}
                    <div className="carousel-indicators">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#bannercarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? "active" : ""}
                            />
                        ))}
                    </div>
                    {/* Slides */}
                    <div className="carousel-inner rounded-4 overflow-hidden">

                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                            >

                                {/* Overlay */}
                                <div className="banner-overlay"></div>

                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}${image.bannerImg}`}
                                    className="d-block w-100 banner-img"
                                    alt="Banner"
                                />

                                {/* Caption */}
                                <div className="carousel-caption">
                                    <h2 className="fw-bold">
                                        Welcome to Our Store
                                    </h2>
                                    <p>
                                        Discover amazing products today
                                    </p>
                                    {role === "USER" &&
                                        <button className="btn btn-primary"
                                            onClick={() => {
                                                navigate('/product')
                                            }}>
                                            Shop Now
                                        </button>
                                    }
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#bannercarousel"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon"></span>
                    </button>

                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#bannercarousel"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon"></span>
                    </button>
                </div>
            )}
        </>
    );
}

export default Imagecarousel;