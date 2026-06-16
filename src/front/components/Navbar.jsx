import { Link } from "react-router-dom";

import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer();

	const logout = () => {
		dispatch({
			type: "set_user",
			payload: null,
		});
		localStorage.removeItem("token");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{!store.user && (
						<Link to="/login">
							<button className="btn btn-primary">Login</button>
						</Link>
					)}
					{
						store.user && (<>
							<span className="navbar-text">
								Welcome, {store.user.email}
							</span>
							<button className="btn btn-secondary ml-2" onClick={logout}>
								Logout
							</button>
						</>
						)
					}

				</div>
			</div>
		</nav>
	);
};