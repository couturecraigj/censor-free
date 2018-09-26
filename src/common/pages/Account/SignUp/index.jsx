import React from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import TextInput from '../../../components/TextInput';
import * as Routes from '../../Routes';

const SIGN_UP = gql`
  mutation SignUp($email: String!) {
    signUp(email: $email) {
      token
      user {
        id
        name
      }
    }
  }
`;

const getVariableValues = eles => {
  return eles.reduce((p, el) => ({ ...p, [el.name]: el.value }), {});
};

const clearVariableValues = eles => {
  return eles.forEach(el => {
    el.value = '';
  });
};

const SignUp = () => {
  const vars = {};
  let form;
  return (
    <div>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <Mutation mutation={SIGN_UP}>
        {signUp => (
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
                signUp({ variables })
                  .then(result => {
                    localStorage.setItem('token', result.data.signUp.token);
                    clearVariableValues(elements);
                  })
                  // eslint-disable-next-line no-console
                  .catch(console.error)
              );
            }}
          >
            <TextInput
              autoComplete="email"
              ref={ref => {
                vars.email = ref;
              }}
              id="SignUp__email"
              label="Email"
              type="email"
              name="email"
            />
            <TextInput
              autoComplete="email"
              ref={ref => {
                vars.confirmEmail = ref;
              }}
              id="SignUp__confirm-email"
              label="Confirm Email"
              type="email"
              name="confirm-email"
            />

            <TextInput
              autoComplete="username"
              ref={ref => {
                vars.username = ref;
              }}
              id="SignUp__name"
              label="Name"
              name="name"
            />
            <TextInput
              id="SignUp__password"
              ref={ref => {
                vars.password = ref;
              }}
              label="Password"
              type="password"
              autoComplete="new-password"
              name="password"
            />
            <TextInput
              id="SignUp__confirm-password"
              ref={ref => {
                vars.confirmPassword = ref;
              }}
              label="Confirm Password"
              autoComplete="new-password"
              type="password"
              name="confirm-password"
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </Mutation>
      <div>
        <Link
          to="/login"
          onMouseOver={Routes.Login.load}
          onFocus={Routes.Login.load}
        >
          Login
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

SignUp.propTypes = {
  // match: PropTypes.shape({
  //   params: PropTypes.shape({
  //     id: PropTypes.string.isRequired
  //   })
  // }).isRequired
};

export default SignUp;
