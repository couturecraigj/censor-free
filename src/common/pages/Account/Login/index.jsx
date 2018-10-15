import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Formik, Form } from 'formik';
import { FormikTextInput } from '../../../components/TextInput';
import * as Routes from '../../Routes';

const initialValues = {
  nameEmail: '',
  password: ''
};

const LOGIN = gql`
  mutation Login($nameEmail: String!, $password: String!) {
    logIn(nameEmail: $nameEmail, password: $password) {
      token
      me {
        id
        userName
        email
      }
    }
  }
`;

// const clearVariableValues = eles => {
//   return eles.forEach(el => {
//     el.value = '';
//   });
// };

const Login = () => {
  return (
    <div>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Mutation mutation={LOGIN}>
        {(logIn, { client }) => (
          <Formik
            initialValues={initialValues}
            onSubmit={(variables, actions) =>
              logIn({ variables })
                .then(result => {
                  actions.resetForm();
                  console.log(actions);
                  localStorage.setItem('token', result.data.logIn.token);
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
                  autoComplete="username"
                  id="Login__name_email"
                  label="Name or Email"
                  name="nameEmail"
                />
                <FormikTextInput
                  id="Login__password"
                  label="Password"
                  type="password"
                  autoComplete="password"
                  name="password"
                />
                <button type="submit">Submit</button>
              </Form>
            )}
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

Login.propTypes = {
  // match: PropTypes.shape({
  //   params: PropTypes.shape({
  //     id: PropTypes.string.isRequired
  //   })
  // }).isRequired
};

export default Login;
