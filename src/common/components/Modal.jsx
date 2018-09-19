import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Div = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
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
  constructor(props) {
    super(props);
    this.state = {
      server: typeof document === 'undefined',
      opacity: 0
    };
    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.server) {
      this.state.modalRoot = document.getElementById('modal');
      this.el = document.createElement('div');
    }
  }

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.state.modalRoot.appendChild(this.el);
    this.fadeIn();
  }

  componentWillUnmount() {
    this.fadeOut();
    // eslint-disable-next-line react/destructuring-assignment
    this.state.modalRoot.removeChild(this.el);
  }
  fadeIn = () => {
    this.setState({
      opacity: 0
    });
    setTimeout(() => {
      this.setState({
        opacity: 0.5
      });
    }, 0);
  };
  fadeOut = () => {
    this.setState({
      opacity: 0
    });
  };
  render() {
    const { children } = this.props;
    const { server, opacity } = this.state;
    const Result = (
      <Div opacity={opacity} ref={this.handleNodeAssign}>
        {children}
      </Div>
    );
    return server ? null : ReactDOM.createPortal(Result, this.el);
  }
}

export default Modal;
