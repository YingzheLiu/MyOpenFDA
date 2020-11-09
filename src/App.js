import React from "react";
import "./App.css";
import SearchForm from "./SearchForm";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Favorites from "./Favorites";
import FavoriteDetail from "./FavoriteDetail";

function App() {
  return (
    <Router>
      <div className="container mt-3">
        <h1>MyOpenFDA</h1>
        <Switch>
          <Route path="/" exact={true}>
            <SearchForm />
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
