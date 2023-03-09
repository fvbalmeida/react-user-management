import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "./App.css";

import User from "./components/user/User";
import UsersList from "./components/user/ListUsers";
import AddUser from "./components/user/AddUser";
import Login from "./components/auth/Login";
import AuthService from "./services/auth/authService";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false
    }
  }

  async componentDidMount() {
    const user = await AuthService.getCurrentUser();

    if (user) {
      const isAdmin = user && user.payload.permission === "admin";
      this.setState({
        isLoggedIn: true,
        isAdmin: isAdmin
      });
    }
  }

  handleLogout = () => {
    AuthService.logout();
    this.setState({ isLoggedIn: false });
  }

  render() {
    const { isAdmin, isLoggedIn } = this.state

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <h1 className="navbar-brand">
            Nextar App
          </h1>
          <div className="navbar-nav mr-auto">
            {isLoggedIn && (
              <li className="nav-item">
                <Link to={"/users"} className="nav-link">
                  Users
                </Link>
              </li>
            )}
            {isAdmin && isLoggedIn && (
              <li className="nav-item">
                <Link to={"/user/create"} className="nav-link">
                  Create user
                </Link>
              </li>
            )}
          </div>
          <div className="navbar-nav ml-auto">
            {isLoggedIn && (
              <li className="nav-item">
                <Link to={"/login"} className="nav-link" onClick={this.handleLogout}>
                  Logout
                </Link>
              </li>
            )}
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/login"]} component={Login} />
            <Route exact path="/users" component={UsersList} />
            <Route exact path="/user/create" component={AddUser} />
            <Route path="/user/:id" component={User} />
          </Switch>
        </div>
      </div >
    );
  }

}

export default App;
