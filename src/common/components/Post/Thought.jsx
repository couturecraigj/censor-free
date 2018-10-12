import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '../TextArea';

const Thought = ({ handleSubmit }) => (
  <form
    onSubmit={e => {
      e.preventDefault();
      handleSubmit(e);
    }}
  >
    <TextArea
      name="description"
      label="Tell me something..."
      id="Thought__TextArea"
    />
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
);

Thought.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default Thought;
