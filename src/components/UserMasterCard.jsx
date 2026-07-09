import { useState, useEffect } from 'react';
import { FaTrash, FaUser, FaUserCheck, FaUserMinus } from "react-icons/fa";
import userService from '../service/user.service';
import '../assets/css/user.css'
import { useSelector } from 'react-redux';

export default function UserMasterCard() {
    const [users, setUsers] = useState([]);
    console.log("users", users);
    const [activeUsers, setActiveUsers] = useState(0);
    const [inactiveUsers, setInactiveUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector((state) => state.profile);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers(token);
            const userData = response.data?.data || [];
            
            setUsers(userData);
            
            // Calculate active and inactive users
            const active = userData.filter(user => user.active).length;
            const inactive = userData.length - active;
            
            setActiveUsers(active);
            setInactiveUsers(inactive);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(userId, token);
                setUsers(users.filter(user => user.id !== userId));
                
                // Recalculate active and inactive users
                const updatedUsers = users.filter(user => user.id !== userId);
                const active = updatedUsers.filter(user => user.active).length;
                const inactive = updatedUsers.length - active;
                
                setActiveUsers(active);
                setInactiveUsers(inactive);
                setError(null);
            } catch (err) {
                setError('Failed to delete user');
                console.error(err);
            }
        }
    };

    return (
        <>
            <main className="container-fluid ">
                {/* Toolbar */}
                <div>
                    <div className="row g-4 mt-2">
                        {/* Active Users */}

                        <div className="col-md-4">

                            <div className="user-card ">

                                <div>
                                    <h5>Active Users</h5>
                                    <h2>{activeUsers}</h2>
                                </div>

                                <FaUserCheck className="icon" size={40} />

                            </div>

                        </div>

                        {/* Inactive Users */}

                        <div className="col-md-4">

                            <div className="user-card">

                                <div>
                                    <h5>Inactive Users</h5>
                                    <h2>{inactiveUsers}</h2>
                                </div>

                                <FaUserMinus className="icon" size={40} />

                            </div>

                        </div>

                        {/* Total Users */}

                        <div className="col-md-4">

                            <div className="user-card">

                                <div>
                                    <h5>Total Users</h5>
                                    <h2>{users.length}</h2>
                                </div>

                                <FaUser className="icon" size={40} />

                            </div>

                        </div>


                    </div>

                    {error && <div className="alert alert-danger p-1">{error}</div>}
                    {loading ? (
                        <div className="text-center mt-4">
                            <p>Loading users...</p>
                        </div>
                    ) : (
                        <div className="row mt-4">
                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>User Id</th>
                                            <th>Profile Image</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th className="text-center">Status</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={user.id || index}>
                                                <td>{user.id}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={
                                                                user.profileImage
                                                                    ? user.profileImage
                                                                    : "https://placehold.co/60x60"
                                                            }
                                                            alt={user.username}
                                                            className="rounded-circle border"
                                                            style={{
                                                                width: "55px",
                                                                height: "55px",
                                                                objectFit: "cover"
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td className="text-center">
                                                    <span className={`badge ${user.active ? 'bg-success' : 'bg-danger'}`}>
                                                        {user.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="text-center ">
                                                    <button
                                                        className="btn btn-light me-2"
                                                        onClick={() => deleteUser(user.id)}
                                                        title="Delete user"
                                                    >
                                                        <FaTrash className='text-danger' style={{ cursor: 'pointer' }} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </>
    );
}