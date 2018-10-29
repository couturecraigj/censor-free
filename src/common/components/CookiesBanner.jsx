import React from 'react';
import styled from 'styled-components';
import { cookie } from 'browser-cookie-lite';
import { Link } from 'react-router-dom';

const CookieNotice = styled.div`
  position: fixed;
  height: 4em;
  display: flex;
  justify-content: stretch;
  align-items: center;
  background-color: #333;
  color: #eee;
  bottom: 0;
  left: 0;
  right: 0;
  a {
    color: lightblue;
    &:visited {
      color: blue;
    }
  }
`;

const CookieText = styled.div`
  flex-grow: 1;
  padding: 1em;
`;

const CookieButtonContainer = styled.div`
  padding: 1em;
`;

const CloseButton = styled.button`
  background-color: #eee;
  color: #333;
`;

class CookiesBanner extends React.Component {
  state = {
    notify: false
  };
  componentDidMount() {
    this.getCookieStatus();
  }
  getCookieStatus = () => {
    const notice = cookie('cookies-notice');

    if (!notice)
      this.setState({
        notify: true
      });
  };
  dismissCookieNotice = () => {
    cookie('cookies-notice', 'dismissed');
    this.setState({
      notify: false
    });
  };
  render() {
    const { notify } = this.state;

    if (!notify) return null;

    return (
      <CookieNotice>
        <CookieText>
          {
            'We Use Cookies if you would like to learn more you can visit our cookie page go '
          }
          <Link to="/legal/cookies" onClick={this.dismissCookieNotice}>
            HERE
          </Link>
        </CookieText>
        <CookieButtonContainer>
          <CloseButton onClick={this.dismissCookieNotice}>Close</CloseButton>
        </CookieButtonContainer>
      </CookieNotice>
    );
  }
}

export default CookiesBanner;
