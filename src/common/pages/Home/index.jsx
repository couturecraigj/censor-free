import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <div>
    Home
    <Link to="about">About</Link>
    <Link to="/user/123">User</Link>
  </div>
);
