import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    let count = 0;

    useEffect(() => {
        getUsers();
    }, []);

    const onDelete = (id) => {
        if (!window.confirm("Do you want to delete this user")) {
            return;
        }
        axiosClient.delete(`users/${id}`).then(() => {
            console.log("user deleted");
        });
        getUsers();
    };

    const getUsers = () => {
        setLoading(true);

        axiosClient
            .get("/users")
            .then(({ data }) => {
                setLoading(false);
                setUsers(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "centre",
                }}
            >
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">
                    Add new
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <td colSpan={"5"} className="text-center">
                                Loading...
                            </td>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {users.map((u) => {
                                return (
                                    <tr>
                                        <td>{u.id}</td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.created_at}</td>
                                        <td>
                                            <Link
                                                to={"/users/" + u.id}
                                                className="btn-edit"
                                            >
                                                Edit
                                            </Link>
                                            &nbsp;
                                            <button
                                                onClick={() => onDelete(u.id)}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}
