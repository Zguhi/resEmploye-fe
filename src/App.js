import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navbar } from "./components";
import { Bookings } from "./pages";
import "./App.css";

const App = () => (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Bookings} />
        </Switch>
      </div>
    </Router>
);

export default App;