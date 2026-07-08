import { FaSearch } from "react-icons/fa";

export default function SearchBar() {

    const handleSearch = (e) => {
        e.preventDefault();

        const value =
            e.target.search.value;

        console.log(value);
    };

    return (
        <form
            className="d-flex mx-lg-4"
            onSubmit={handleSearch}
        >
            <div className="input-group">
                <input
                    name="search"
                    type="search"
                    className="form-control"
                    placeholder="Search products..."
                />

                <button
                    className="btn btn-primary"
                >
                    <FaSearch></FaSearch>
                    {/* 🔍 */}
                </button>

            </div>
        </form>
    );
}