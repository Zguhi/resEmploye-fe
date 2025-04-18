import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => (
    <nav className="app__navbar">
        <div className="app__navbar-logo">
            <h1>Restaurant Admin Dashboard</h1>
        </div>
        <ul className="app__navbar-links">
            <li className="p__opensans">
                <Link to="/">Dashboard</Link>
            </li>
        </ul>
    </nav>
);

export default Navbar;