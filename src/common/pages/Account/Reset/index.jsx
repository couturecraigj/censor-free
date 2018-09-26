import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import * as Routes from '../../Routes';
import TextInput from '../../../components/TextInput';

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

// const clearVariableValues = eles => {
//   return eles.forEach(el => {
//     el.value = '';
//   });
// };

const ResetPassword = ({
  match: {
    params: { token }
  }
}) => {
  let form;
  return (
    <div>
      <Helmet>
        <title>ResetPassword</title>
      </Helmet>
      <Mutation mutation={LOGIN}>
        {resetPassword => (
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
                resetPassword({ variables })
                  .then(result => {
                    localStorage.setItem(
                      'token',
                      result.data.resetPassword.token
                    );
                    // document.cookie = 'token=' + result.data.resetPassword.token;
                    // location.reload();
                  })
                  // eslint-disable-next-line no-console
                  .catch(console.error)
              );
            }}
          >
            <input readOnly value={token} hidden id="" name="token" />
            <TextInput
              autoComplete="new-password"
              id="Reset__password"
              label="New Password"
              type="password"
              name="password"
            />
            <TextInput
              id="Reset__confirm-password"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              name="confirmPassword"
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

ResetPassword.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired
    })
  }).isRequired
};

export default ResetPassword;
