import React from "react";
import "./App.css";
import SearchForm from "./SearchForm";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Favorites from "./Favorites";
import FavoriteDetail from "./FavoriteDetail";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import About from "./About";

function App() {
  return (
    <Router>
      <div className="row mt-3 mr-3" style={{ float: "right" }}>
        <Link to={`/about/`} className="btn btn-link">
          About
        </Link>
        <div className="my-1 mr-2">|</div>
        <FontAwesomeIcon
          icon={faUserCircle}
          size={"2x"}
          color={"#07226D"}
          className=""
        />
        <Link to={`/favorites/`} className="btn btn-link">
          My Favorites
        </Link>
      </div>
      <br></br>
      <div className="container mt-3">
        <h1>MyOpenFDA</h1>
        <Switch>
          <Route path="/" exact={true}>
            <SearchForm />
          </Route>
          <Route path="/about" exact={true}>
            <About />
          </Route>
          <Route path="/favorites" exact={true}>
            <Favorites />
          </Route>
          <Route path="/favorites/:id" exact={true}>
            <FavoriteDetail />
          </Route>
          <Route path="*" exact={true}>
            <PageNotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
