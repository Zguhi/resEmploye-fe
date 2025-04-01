import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./App.css";

const App = () => (
    <Router>
        <div>
            <Navbar />
            <Routes>
                <Route exact path="/" component={Dashboard} />
            </Routes>
        </div>
    </Router>
);

export default App;