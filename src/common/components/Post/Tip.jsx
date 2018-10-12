import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

const Tip = ({ handleSubmit }) => (
  <form
    onSubmit={e => {
      e.preventDefault();
      handleSubmit(e);
    }}
  >
    <TextInput name="title" label="Subject" id="Tip__subject" />
    <TextArea name="description" label="Body" id="Tip__body" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
);

Tip.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default Tip;
