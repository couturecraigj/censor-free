import React from 'react';
// import PropTypes from 'prop-types';
// import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

// const Link = styled(NavLink).attrs({ activeClassName: 'current' })`
//   font-size: 20px;
//   line-height: 2rem;
//   padding: 0 0.3rem;
//   height: 2rem;
//   &.current {
//     color: red;
//   }
// `;

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-decoration: none;
  background-color: #ddd;
  font-size: 20px;
`;

const Layout = () => <Footer>copyright: Craig Couture</Footer>;

Layout.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  // togglePost: PropTypes.func.isRequired
};

export default Layout;
