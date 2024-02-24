import React from "react";
import { Link } from "react-router-dom";
import Logo from "/workspaces/alondragerke-fspt53-authentication-system/src/front/img/logo black.png";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light">
			<div className="container">
				<Link to="/" className="link-style">
					<img src={Logo} className="logo" />
				</Link>
				<div className="d-grid gap-2 d-md-flex justify-content-md-end">
					<Link to="/login" className="link-style">
						<button className="btn me-md-2" type="button">Log in</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
