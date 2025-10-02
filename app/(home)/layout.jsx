import React from "react";

const HomeLayout = ({ children }) => {
	return (
		<>
			<header>{/* Navbar */}</header>
			<main>
			{/* Left sidebar */}
			{children}
			{/* Right sidebar */}
			</main>
			<footer>{/* Footer */}</footer>
		</>
	);
};

export default HomeLayout;
