import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound center">
      <h2>Page not found</h2>
      <p>
        <Link className="btn" to="/">Back to Notes</Link>
      </p>
    </div>
  );
}
