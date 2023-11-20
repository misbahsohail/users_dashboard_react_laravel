import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";

export default function UserForm() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        id: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();

    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setUser(data.data);
                })
                .catch((err) => {
                    setLoading(false);
                    const response = err.message.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }, []);
    } else {
    }
    const onSubmit = (ev) => {
        ev.preventDefault();
        if (id) {
            axiosClient.put(`/users/${id}`, user).then(() => {
                navigate("/users");
            });
        } else {
            axiosClient
                .post("/signup", user)
                .then(() => {
                    navigate("/users");
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err);
                    const response = err.message.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };
    return (
        <div>
            {user.id && <h1>Update User: {user.name}</h1>}
            {!user.id && <h1>New User</h1>}
            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading...</div>}
                {errors && (
                    <div className="alert">
                        {Object.values(errors).map((error) => (
                            <p>{error}</p>
                        ))}
                    </div>
                )}
                {!loading && (
                    <form onSubmit={onSubmit}>
                        <input
                            value={user.name}
                            onChange={(event) => {
                                setUser({ ...user, name: event.target.value });
                            }}
                            placeholder="Full Name"
                        />
                        <input
                            value={user.email}
                            onChange={(event) => {
                                setUser({ ...user, email: event.target.value });
                            }}
                            type="email"
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            onChange={(event) => {
                                setUser({
                                    ...user,
                                    password: event.target.value,
                                });
                            }}
                            placeholder="Password"
                        />
                        <input
                            type="password"
                            onChange={(event) => {
                                setUser({
                                    ...user,
                                    password_confirmation: event.target.value,
                                });
                            }}
                            placeholder="Password confirmation"
                        />
                        <button className="btn">Save</button>
                    </form>
                )}
            </div>
        </div>
    );
}
