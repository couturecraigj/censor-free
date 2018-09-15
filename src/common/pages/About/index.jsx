import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <div>
    <Link to="/">Home</Link>
    About
    <Link to="/user/123">User</Link>
  </div>
);
