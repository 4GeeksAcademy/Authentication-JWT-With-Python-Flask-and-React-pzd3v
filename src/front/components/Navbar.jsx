import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"; // 1. Importamos el cable


export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer();


	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{/* 3. Lógica Condicional: Si NO hay token, muestra Login */}
					{!store.token ? (
						<Link to="/login">
							<button className="btn btn-primary">Log in</button>
						</Link>
					) : (
						<Link to="/">
							<button className="btn btn-danger" onClick={() => dispatch({ type: "login", payload: null })}>
								Log Out
							</button>
						</Link>

					)}
				</div>
			</div>
		</nav>
	);
};