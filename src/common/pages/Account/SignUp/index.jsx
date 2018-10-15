import React from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Redirect } from 'react-router';
import { FormikTextInput } from '../../../components/TextInput';
import * as Routes from '../../Routes';

const SIGN_UP = gql`
  mutation SignUp(
    $email: String!
    $confirmEmail: String!
    $password: String!
    $confirmPassword: String!
    $userName: String!
  ) {
    signUp(
      email: $email
      confirmEmail: $confirmEmail
      password: $password
      confirmPassword: $confirmPassword
      userName: $userName
    ) {
      token
      me {
        id
        userName
        email
      }
    }
  }
`;

const SignUp = () => {
  return (
    <div>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <Mutation mutation={SIGN_UP}>
        {(signUp, { client, data }) =>
          data?.signUp ? (
            <Redirect to="/" />
          ) : (
            <Formik
              // initialValues={initialValues}
              onSubmit={(variables, actions) =>
                signUp({ variables })
                  .then(result => {
                    localStorage.setItem('token', result.data.logIn.token);
                    actions.resetForm();
                    client.resetStore();

                    // document.cookie = 'token=' + result.data.logIn.token;
                    // location.reload();
                  })
                  // eslint-disable-next-line no-console
                  .catch(console.error)
              }
            >
              {() => (
                <Form>
                  <FormikTextInput
                    autoComplete="email"
                    id="SignUp__email"
                    label="Email"
                    type="email"
                    name="email"
                  />
                  <FormikTextInput
                    autoComplete="email"
                    id="SignUp__confirm-email"
                    label="Confirm Email"
                    type="email"
                    name="confirmEmail"
                  />

                  <FormikTextInput
                    autoComplete="username"
                    id="SignUp__name"
                    label="Name"
                    name="userName"
                  />
                  <FormikTextInput
                    id="SignUp__password"
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    name="password"
                  />
                  <FormikTextInput
                    id="SignUp__confirm-password"
                    label="Confirm Password"
                    autoComplete="new-password"
                    type="password"
                    name="confirmPassword"
                  />
                  <button type="submit">Submit</button>
                </Form>
              )}
            </Formik>
          )
        }
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
