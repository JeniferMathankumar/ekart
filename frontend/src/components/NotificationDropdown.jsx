export default function NotificationDropdown() {

    const notifications = [
        "New Order Received",
        "Product Added",
        "Payment Success"
    ];

    return (

        <li className="nav-item dropdown position-relative">

            <a
                href="#"
                className="nav-link"
                data-bs-toggle="dropdown"
            >
                🔔Notifications
            </a>

            <span
                className="
                badge bg-danger
                position-absolute
            
                translate-middle"
                style={{top:'10px',right:'-10px'}}
            >
                {notifications.length}
            </span>

            <ul className="dropdown-menu dropdown-menu-end">

                {
                    notifications.map(
                        (n, index) => (
                            <li
                                key={index}
                            >
                                <span
                                    className="dropdown-item"
                                >
                                    {n}
                                </span>
                            </li>
                        )
                    )
                }

            </ul>

        </li>

    );
}