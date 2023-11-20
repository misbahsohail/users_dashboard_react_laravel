import React from "react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Login() {
    const emailRef = useRef();
    const passRef = useRef();
    const [errors, setErrors] = useState(null);
    const { setUser, setToken } = useStateContext();

    const onSubmit = async (ev) => {
        ev.preventDefault();
        const payload = {
            email: emailRef.current.value,
            password: passRef.current.value,
        };
        setErrors(null);

        try {
            const { data } = await axiosClient.post("/login", payload);
            debugger;
            if (data) {
                setUser(data.user);
                setToken(data.token);
            }
        } catch (err) {
            const response = err.response;

            if (response && response.status === 422) {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                } else {
                    setErrors({ email: [response.data.message] });
                }
            }
        }
    };
    return (
        <div>
            <h1>Login into your account</h1>
            {errors && (
                <div className="alert">
                    {Object.values(errors).map((error) => (
                        <p>{error}</p>
                    ))}
                </div>
            )}
            <form onSubmit={onSubmit}>
                <input ref={emailRef} type="email" placeholder="Email" />
                <input ref={passRef} type="password" placeholder="password" />
                <button className="btn btn-block">Login</button>
                <p className="message">
                    Not Registered? <Link to="/signup">Create an account</Link>
                </p>
            </form>
        </div>
    );
}
