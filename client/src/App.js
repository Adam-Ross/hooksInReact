import React, { Fragment } from "react";
import Navbar from "./components/layout/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import ContactState from "./context/contact/ContactState";
import Login from "./components/layout/Login";
import About from "./components/About";
import AuthState from "./context/auth/AuthState";
import AlertState from "./context/alert/AlertState";
import Alerts from "./components/layout/Alerts";
import Register from "./components/layout/Register";

import "./App.css";

const App = () => {
  return (
    <AuthState>
      <AlertState>
        <ContactState>
          <Fragment>
            <Router>
              <Navbar />
              <div className="container">
                <Alerts />
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/about" component={About} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/register" component={Register} />
                </Switch>
              </div>
            </Router>
          </Fragment>
        </ContactState>
      </AlertState>
    </AuthState>
  );
};

export default App;
