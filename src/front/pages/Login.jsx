import { useState } from "react";
import useGloalReducer from "../hooks/useGlobalReducer";

import { useNavigate } from "react-router-dom";

const Login = () => {

    const { dispatch } = useGloalReducer();

    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const login = async () => {
        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        };

        const backendUrl = import.meta.env.VITE_BACKEND_URL

        const response = await fetch(backendUrl + "/api/login", fetchOptions);
        const data = await response.json();
        console.log(data.access_token, data.user);

        localStorage.setItem("token", data.access_token);

        dispatch({
            type: "set_user",
            payload: data.user,
        });

        if (response.ok) {
            navigate("/");
        }
    }

    return <div className="container mt-5">
        <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
            <h1>Login Page</h1>
            <p>This is the login page. You can add your login form here.</p>
            <form>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" placeholder="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        login();
                    }}
                >Login</button>
            </form>
        </div>
    </div>
}

export default Login;