import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import * as Routes from '../../Routes';
import TextInput from '../../../components/TextInput';

const LOGIN = gql`
  mutation Login($nameEmail: String!, $password: String!) {
    logIn(nameEmail: $nameEmail, password: $password) {
      token
      user {
        id
        userName
        email
      }
    }
  }
`;

const getVariableValues = eles => {
  return eles.reduce((p, el) => ({ ...p, [el.name]: el.value }), {});
};

// const clearVariableValues = eles => {
//   return eles.forEach(el => {
//     el.value = '';
//   });
// };

const Login = () => {
  let form;
  return (
    <div>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Mutation mutation={LOGIN}>
        {logIn => (
          <form
            ref={ref => {
              form = ref;
            }}
            onSubmit={e => {
              e.preventDefault();
              const elements = [...form.elements].filter(
                el => el.tagName !== 'BUTTON'
              );
              const variables = getVariableValues(elements);
              return (
                logIn({ variables })
                  .then(result => {
                    localStorage.setItem('token', result.data.logIn.token);
                    // document.cookie = 'token=' + result.data.logIn.token;
                    // location.reload();
                  })
                  // eslint-disable-next-line no-console
                  .catch(console.error)
              );
            }}
          >
            <TextInput
              autoComplete="username"
              id="Login__name_email"
              label="Name or Email"
              name="nameEmail"
            />
            <TextInput
              id="Login__password"
              label="Password"
              type="password"
              autoComplete="password"
              name="password"
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </Mutation>
      <div>
        <Link
          to="/sign-up"
          onMouseOver={Routes.SignUp.load}
          onFocus={Routes.SignUp.load}
        >
          Sign Up
        </Link>
      </div>
      <div>
        <Link
          to="/account/forgot-password"
          onMouseOver={Routes.ForgotPassword.load}
          onFocus={Routes.ForgotPassword.load}
        >
          Forgot Password
        </Link>
      </div>
    </div>
  );
};

Login.propTypes = {
  // match: PropTypes.shape({
  //   params: PropTypes.shape({
  //     id: PropTypes.string.isRequired
  //   })
  // }).isRequired
};

export default Login;
