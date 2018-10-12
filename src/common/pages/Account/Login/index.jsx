import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Formik, Form } from 'formik';
import * as Routes from '../../Routes';
import TextInput from '../../../components/TextInput';

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
        {logIn => (
          <Formik
            initialValues={initialValues}
            onSubmit={variables =>
              logIn({ variables })
                .then(result => {
                  localStorage.setItem('token', result.data.logIn.token);
                  // document.cookie = 'token=' + result.data.logIn.token;
                  // location.reload();
                })
                // eslint-disable-next-line no-console
                .catch(console.error)
            }
          >
            {() => (
              <Form>
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
