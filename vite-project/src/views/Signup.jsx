import React from "react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
export default function Signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passRef = useRef();
    const confirmPassRef = useRef();
    const { setUser, setToken } = useStateContext();
    const [errors, setErrors] = useState(null);

    const onSubmit = async (ev) => {
        ev.preventDefault();
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passRef.current.value,
            password_confirmation: confirmPassRef.current.value,
        };

        try {
            const { data } = await axiosClient.post("/signup", payload);
            if (data) {
                setUser(data.user);
                setToken(data.token);
            }
        } catch (err) {
            const response = err.message.response;
            if (response && response.status === 422) {
                setErrors(response.data.errors);
            }
        }
    };

    return (
        <div>
            <h1>Create an account</h1>
            {errors && (
                <div className="alert">
                    {Object.values(errors).map((error) => (
                        <p>{error}</p>
                    ))}
                </div>
            )}
            <form onSubmit={onSubmit}>
                <input ref={nameRef} placeholder="Full Name" />
                <input ref={emailRef} type="email" placeholder="Email" />
                <input ref={passRef} type="password" placeholder="Password" />
                <input
                    ref={confirmPassRef}
                    type="password"
                    placeholder="Password confirmation"
                />
                <button className="btn btn-block">Login</button>
                <p className="message">
                    Already Registered? <Link to="/login">Sign in</Link>
                </p>
            </form>
        </div>
    );
}
