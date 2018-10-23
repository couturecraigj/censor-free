import React from 'react';
// import PropTypes from 'prop-types';
const { Provider, Consumer } = React.createContext({
  formComponent: ({ deepRef, ...props }) => (
    <form>
      <div {...props} ref={deepRef}>
        <input />
      </div>
    </form>
  )
});

export { Provider, Consumer };
