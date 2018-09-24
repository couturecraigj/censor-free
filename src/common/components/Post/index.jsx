import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TogglePostTypes from './TogglePostTypes';
import Modal from '../Modal';

const __PROD__ = process.env.NODE_ENV === 'production';
const list = [
  // TODO: Make sure you make it so these
  // TODO: hot reload in dev mode
  {
    name: 'Post',
    module: __PROD__
      ? () => import(/* webpackChunkName: 'new-post' */ './Post')
      : require('./Post')
  },
  {
    name: 'Video',
    module: __PROD__
      ? () => import(/* webpackChunkName: 'new-video' */ './Video')
      : require('./Video')
  },
  {
    name: 'Photo',
    module: __PROD__
      ? () => import(/* webpackChunkName: 'new-photo' */ './Photo')
      : require('./Photo')
  },
  {
    name: 'Review',
    module: __PROD__
      ? () => import(/* webpackChunkName: 'new-review' */ './Review')
      : require('./Review')
  },
  {
    name: 'Question',
    module: __PROD__
      ? () => import(/* webpackChunkName: 'new-question' */ './Question')
      : require('./Question')
  },
  {
    name: 'Tip',
    module: __PROD__
      ? () => import(/* webpackChunkName: 'new-tip' */ './Tip')
      : require('./Tip')
  },
  {
    name: 'Story',
    module: __PROD__
      ? () => import(/* webpackChunkName: 'new-story' */ './Story')
      : require('./Story')
  }
];

const Div = styled.div`
  background: #eee;
  display: grid;
  padding: 1rem;
  border-radius: 0.4rem;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
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

const Tabs = styled.div`
  float: right;
  display: inline-flex;
  padding: 0 1rem;
`;

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.outsideDiv = React.createRef();
    this.modalDiv = React.createRef();
    this.state = {
      Component: () => <div>Loading...</div>
    };
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
  selectedPost = component => {
    this.setState({
      Component: component
    });
  };
  render() {
    const { close } = this.props;
    const { Component } = this.state;
    // const { postType, post } = this.state;
    // TODO: Create a Wizard that will ask for filterable categories
    return (
      <Modal close={close} ref={this.modalDiv}>
        <div ref={this.outsideDiv}>
          <Div>
            <div>
              <Close type="button" onClick={close}>
                ✕
              </Close>
              <Tabs>
                <TogglePostTypes list={list} selectedPost={this.selectedPost} />
              </Tabs>
            </div>
            <Component />
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
