import React from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  return (
    <>
      <div className="header">
        <Helmet>
          <meta charSet="UTF-8" />
          <title>Page Not Found</title>
        </Helmet>
      </div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={`/`}>Home</Link>
          </li>
        </ol>
      </nav>
      <div>
        <h4 data-testid="pageNotFound">404: Page not found</h4>
        <p>
          The requested url <code>{location.pathname}</code> was not found on
          this server
        </p>
      </div>
    </>
  );
}
