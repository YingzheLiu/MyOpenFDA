import React, { useEffect, useState } from "react";
import "./App.css";
import SearchForm from "./SearchForm";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Favorites from "./Favorites";
import FavoriteDetail from "./FavoriteDetail";
import { fatchFavorites, fetchFavorites } from "./api";

function App() {
  // const favorites = [
  //   {
  //     id: 0,
  //     drugName: "remicade",
  //     adverseEvent: "drug ineffective",
  //     numOfDrugReport: 117505,
  //     numOfAdverseEventReport: 768745,
  //     numOfDrugAndAEReport: 16464,
  //     numOfTotalReport: 12254197,
  //     dateTime: "08/11/2020 11:22:20",
  //   },
  //   {
  //     id: 1,
  //     drugName: "inflectra",
  //     adverseEvent: "infection",
  //     numOfDrugReport: 6094,
  //     numOfAdverseEventReport: 80383,
  //     numOfDrugAndAEReport: 117,
  //     numOfTotalReport: 12254197,
  //     dateTime: "08/10/2020 11:22:20",
  //   },
  // ];

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
