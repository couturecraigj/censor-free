import React from 'react';
import { Helmet } from 'react-helmet';
import VideoPlayer from '../../components/VideoPlayer';

// TODO: Make it so main pages gives a good overview

export default class extends React.Component {
  state = {
    value: {}
  };
  onChange = ({ target: { value } }) => {
    this.setState({
      value
    });
  };
  render() {
    const { value } = this.state;
    console.log(value);
    return (
      <div>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <div>
          Home
          <div>
            <VideoPlayer
              src="http://localhost:3000/5bb3b25e69b02ed5724ab2ac/46137260-d60d-43fa-924a-3c34f66338ab/9bf019c5-42b6-4eda-99c5-4c38d39c66d9"
              poster="http://localhost:3000/5bb3b25e69b02ed5724ab2ac/46137260-d60d-43fa-924a-3c34f66338ab/9bf019c5-42b6-4eda-99c5-4c38d39c66d9/1.png"
              width="640"
              value={value}
              controls
              formComponent={({ innerRef, ...props }) => (
                <form>
                  <div {...props} ref={innerRef}>
                    <input />
                  </div>
                </form>
              )}
              onEdit={this.onChange}
              name="position"
              editing
            />
          </div>
        </div>
      </div>
    );
  }
}
