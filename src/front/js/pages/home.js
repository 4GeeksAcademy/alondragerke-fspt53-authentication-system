import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {

	return (

		<div className="text-center mt-5 home-page">
			<h1>Welcome to Secure Access!</h1>
			<Link to="/login" className="link-style">
				<button className="btn btn-home me-md-2" type="button">Log in</button>
			</Link>
			<Link to="/signup" className="link-style">
				<button className="btn btn-home me-md-2" type="button">Sign up</button>
			</Link>
		</div>
	);
};
