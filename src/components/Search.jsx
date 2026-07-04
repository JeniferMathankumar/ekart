export default function Search() {
    return (
        <div className="input-group" style={{ maxWidth: "300px" }}>
            <span className="input-group-text">
                <FaSearch ></FaSearch>
            </span>
            <input
                type="search"
                className="form-control"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search products"
            />
        </div>
    );
}