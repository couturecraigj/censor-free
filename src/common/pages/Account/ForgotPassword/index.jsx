import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import { FormikTextInput } from '../../../components/TextInput';
import * as Routes from '../../Routes';

const LOGIN = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

const ForgotPassword = ({ loggedIn }) => {
  return (
    <div>
      <Helmet>
        <title>ForgotPassword</title>
      </Helmet>
      {loggedIn && <Redirect to="/" />}
      <Mutation mutation={LOGIN}>
        {forgotPassword => (
          <Formik onSubmit={variables => forgotPassword({ variables })}>
            <Form>
              <FormikTextInput
                autoComplete="email"
                id="Forgot__name_email"
                label="Email"
                name="email"
              />
              <button type="submit">Submit</button>
            </Form>
          </Formik>
        )}
      </Mutation>
      <Link
        to="/login"
        onMouseOver={Routes.Login.load}
        onFocus={Routes.Login.load}
      >
        Login
      </Link>
    </div>
  );
};

ForgotPassword.propTypes = {
  loggedIn: PropTypes.bool.isRequired
};

export default connect(({ loggedIn }) => ({ loggedIn }))(ForgotPassword);
