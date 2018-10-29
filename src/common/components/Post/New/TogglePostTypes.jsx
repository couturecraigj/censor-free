import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const PostType = styled(
  ({ onClick, postType, name, isChosen, children, ...props }) => (
    <button {...props} type="button" onClick={() => onClick(postType, name)}>
      {children}
    </button>
  )
)`
  float: left;
  border: none;
  font-size: 10pt;
  padding: 3rem 0;
  height: 1.3rem;
  margin: 0 0 1rem 0;
  ${props =>
    props.isChosen
      ? css`
          background: #ccc;
        `
      : css`
          background: #777;
        `} padding: 0 0.5rem;
`;

class TogglePostTypes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null
    };
  }

  componentDidMount() {
    const {
      list: [postType]
    } = this.props;

    this.togglePostType(postType);
  }

  togglePostType = postType => {
    const { selectedPost } = this.props;

    this.setState({
      post: postType.name
    });

    return selectedPost(postType.module, postType.initialValues);
  };

  render() {
    const { list } = this.props;
    const { togglePostType } = this;
    const { post } = this.state;

    return (
      <React.Fragment>
        {list.map(postType => (
          <PostType
            isChosen={post === postType.name}
            name={postType.name}
            key={postType.name}
            postType={postType}
            onClick={togglePostType}
            onMouseOver={postType.module.load}
            onFocus={postType.module.load}
          >
            {postType.name}
          </PostType>
        ))}
      </React.Fragment>
    );
  }
}

TogglePostTypes.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      module: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired
    })
  ).isRequired,
  selectedPost: PropTypes.func.isRequired
};

export default TogglePostTypes;
