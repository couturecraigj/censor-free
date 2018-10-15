import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Formik, Form } from 'formik';
import { FormikTextInput } from '../../../components/TextInput';
import * as Routes from '../../Routes';

const LOGIN = gql`
  mutation ResetPassword(
    $password: String!
    $confirmPassword: String!
    $token: String!
  ) {
    resetPassword(
      password: $password
      confirmPassword: $confirmPassword
      token: $token
    ) {
      token
      me {
        id
        userName
      }
    }
  }
`;
const ResetPassword = ({
  match: {
    params: { token }
  }
}) => {
  return (
    <div>
      <Helmet>
        <title>ResetPassword</title>
      </Helmet>
      <Mutation mutation={LOGIN}>
        {resetPassword => (
          <Formik
            initialValues={{ token }}
            onSubmit={variables => resetPassword({ variables })}
          >
            <Form>
              <FormikTextInput
                autoComplete="new-password"
                id="Reset__password"
                label="New Password"
                type="password"
                name="password"
              />
              <FormikTextInput
                id="Reset__confirm-password"
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                name="confirmPassword"
              />
              <button type="submit">Submit</button>
            </Form>
          </Formik>
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

ResetPassword.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired
    })
  }).isRequired
};

export default ResetPassword;
