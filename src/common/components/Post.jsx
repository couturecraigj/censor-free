import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Modal from './Modal';

const Div = styled.div`
  background: #eee;
  display: grid;
  padding: 1rem;
  border-radius: 0.4rem;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
`;

const PostType = styled.div`
  float: left;
  background: #eee;
  padding: 0 0.5rem;
`;

const Close = styled.button`
  float: right;
  background: #000;
  color: #eee;
  font-size: 10;
  padding: 0;
  height: 1.3rem;
  width: 1.3rem;
  border-radius: 0.8rem;
  border: none;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
`;

const postInput = 'post_input';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.outsideDiv = React.createRef();
    this.modalDiv = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClose, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClose, false);
  }

  handleClose = e => {
    const { close } = this.props;
    if (this.outsideDiv.current.contains(e.target)) {
      return;
    }
    close(true);
  };

  render() {
    const { close } = this.props;

    return (
      <Modal close={close} ref={this.modalDiv}>
        <div ref={this.outsideDiv}>
          <Div>
            <div>
              <PostType>Post</PostType>
              <PostType>Video</PostType>
              <PostType>Review</PostType>
              <PostType>Question</PostType>
              <PostType>Tip</PostType>
              <PostType>Story</PostType>
              <Close type="button" onClick={close}>
                ✕
              </Close>
            </div>
            <div>
              <label htmlFor={postInput}>What Are you thinking?</label>
              <input id={postInput} />
              <div>
                <button type="submit">Submit</button>
              </div>
            </div>
          </Div>
        </div>
      </Modal>
    );
  }
}

Post.propTypes = {
  close: PropTypes.func.isRequired
};

export default Post;
