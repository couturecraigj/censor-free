import React from 'react';
import PropTypes from 'prop-types';
import loadable from 'loadable-components';
import styled from 'styled-components';
import TogglePostTypes from './TogglePostTypes';
import Modal from '../Modal';

const list = [
  {
    name: 'Thought',
    module: loadable(() =>
      import(/* webpackChunkName: 'new-thought' */ './Thought')
    )
  },
  {
    name: 'Video',
    module: loadable(() =>
      import(/* webpackChunkName: 'new-video' */ './Video')
    )
  },
  {
    name: 'Photo',
    module: loadable(() =>
      import(/* webpackChunkName: 'new-photo' */ './Photo')
    )
  },
  {
    name: 'Review',
    module: loadable(() =>
      import(/* webpackChunkName: 'new-review' */ './Review')
    )
  },
  {
    name: 'Question',
    module: loadable(() =>
      import(/* webpackChunkName: 'new-question' */ './Question')
    )
  },
  {
    name: 'Tip',
    module: loadable(() => import(/* webpackChunkName: 'new-tip' */ './Tip'))
  },
  {
    name: 'Story',
    module: loadable(() =>
      import(/* webpackChunkName: 'new-story' */ './Story')
    )
  }
];

const Div = styled.div`
  background: #eee;
  max-height: 100%;
  min-height: 0;
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
        <div
          ref={this.outsideDiv}
          // style={{ overflow: 'scroll', maxHeight: '100%', maxWidth: '100%' }}
        >
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
