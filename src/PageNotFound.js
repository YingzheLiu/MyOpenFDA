import React from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

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
      <div>
        <h3 data-testid="pageNotFound">404: Page not found</h3>
        <p>
          The requested url <code>{location.pathname}</code> was not found on
          this server
        </p>
      </div>
    </>
  );
}
