import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Bookings from "./pages/ Bookings/Bookings";
import "./App.css";

const App = () => (
    <Router>
        <div>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Bookings />} />
            </Routes>
        </div>
    </Router>
);

export default App;