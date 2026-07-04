import { useState } from "react";
import useGloalReducer from "../hooks/useGlobalReducer";

const Register = () => {

    const { dispatch } = useGloalReducer();

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const register = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                throw new Error("Failed to register");
            }

            const data = await response.json();
            dispatch({ type: "REGISTER_SUCCESS", payload: data });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
                <h1>Register Page</h1>
                <p>This is the register page. You can add your registration form here.</p>
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
                            register();
                        }}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;