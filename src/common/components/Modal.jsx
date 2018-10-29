import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Div = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: scroll;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, ${({ opacity }) => opacity});
  transition: all 0.3s;
`;

class Modal extends React.Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    children: PropTypes.any.isRequired
  };
  state = {
    server: true,
    opacity: 0,
    el: undefined
  };
  static getDerivedStateFromProps() {
    if (typeof document !== 'undefined') {
      return {
        server: false
      };
    }

    return null;
  }

  componentDidMount() {
    this.getModalRoot();
  }

  componentWillUnmount() {
    this.fadeOut();
    // eslint-disable-next-line react/destructuring-assignment
    this.state.modalRoot.removeChild(this.state.el);
  }
  getModalRoot = () => {
    this.setState(
      {
        modalRoot: document.getElementById('modal')
      },
      () => {
        this.setState(
          {
            el: document.createElement('div')
          },
          () => {
            // eslint-disable-next-line react/destructuring-assignment
            this.state.modalRoot.appendChild(this.state.el);
            this.fadeIn();
          }
        );
      }
    );
  };
  fadeIn = () => {
    this.setState({
      opacity: 0
    });
    setTimeout(() => {
      this.setState({
        opacity: 0.5
      });
    }, 10);
  };
  fadeOut = () => {
    this.setState({
      opacity: 0
    });
  };
  renderModal = () => {
    const { children } = this.props;
    const { el, opacity } = this.state;
    const Result = (
      <Div opacity={opacity} ref={this.handleNodeAssign}>
        <div
          style={{ overflow: 'scroll', maxHeight: '100%', maxWidth: '100%' }}
        >
          {children}
        </div>
      </Div>
    );

    return ReactDOM.createPortal(Result, el);
  };
  render() {
    const { server, el } = this.state;

    return server || !el ? null : this.renderModal();
  }
}

export default Modal;
