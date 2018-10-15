import React from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
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
        {(signUp, { client }) => (
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
                  ref={ref => {
                    vars.email = ref;
                  }}
                  id="SignUp__email"
                  label="Email"
                  type="email"
                  name="email"
                />
                <FormikTextInput
                  autoComplete="email"
                  ref={ref => {
                    vars.confirmEmail = ref;
                  }}
                  id="SignUp__confirm-email"
                  label="Confirm Email"
                  type="email"
                  name="confirmEmail"
                />

                <FormikTextInput
                  autoComplete="username"
                  ref={ref => {
                    vars.username = ref;
                  }}
                  id="SignUp__name"
                  label="Name"
                  name="userName"
                />
                <FormikTextInput
                  id="SignUp__password"
                  ref={ref => {
                    vars.password = ref;
                  }}
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  name="password"
                />
                <FormikTextInput
                  id="SignUp__confirm-password"
                  ref={ref => {
                    vars.confirmPassword = ref;
                  }}
                  label="Confirm Password"
                  autoComplete="new-password"
                  type="password"
                  name="confirmPassword"
                />
                <button type="submit">Submit</button>
              </Form>
            )}
          </Formik>
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
