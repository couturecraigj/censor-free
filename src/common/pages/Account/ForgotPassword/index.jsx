import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import TextInput from '../../../components/TextInput';
import * as Routes from '../../Routes';

const LOGIN = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
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

const ForgotPassword = () => {
  let form;
  return (
    <div>
      <Helmet>
        <title>ForgotPassword</title>
      </Helmet>
      <Mutation mutation={LOGIN}>
        {forgotPassword => (
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
                forgotPassword({ variables })
                  .then(result => {
                    localStorage.setItem(
                      'token',
                      result.data.forgotPassword.token
                    );
                    clearVariableValues(elements);
                  })
                  // eslint-disable-next-line no-console
                  .catch(console.error)
              );
            }}
          >
            <TextInput
              autoComplete="email"
              id="Forgot__name_email"
              label="Email"
              name="email"
            />
            <button type="submit">Submit</button>
          </form>
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
  // match: PropTypes.shape({
  //   params: PropTypes.shape({
  //     id: PropTypes.string.isRequired
  //   })
  // }).isRequired
};

export default ForgotPassword;
