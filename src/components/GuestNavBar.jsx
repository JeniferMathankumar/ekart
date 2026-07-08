export default function GuestNavBar() {
    return (
        <>
            <NavLink to="/">Home</NavLink>

            <NavLink to="/categories">
                Categories
            </NavLink>

            <NavLink to="/products">
                Products
            </NavLink>

            <NavLink to="/offers">
                Offers
            </NavLink>

            <NavLink to="/contact">
                Contact
            </NavLink>
        </>
    );
}