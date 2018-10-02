import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Resumable from 'resumablejs';
import Progress from './Progress';

const Img = styled.img`
  max-width: 300px;
  height: auto;
`;

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      uploading: false,
      reader: new FileReader(),
      progress: 0,
      value: '',
      height: '',
      width: ''
    };
    this.resumable = new Resumable({
      target: '/files',
      query: {
        upload_token: 'my_token'
      }
    });

    this.input = React.createRef();
    const { reader } = this.state;
    reader.onload = e => {
      const img = new Image();

      img.onload = () => {
        this.setState({
          width: +img.width,
          height: +img.height
        }); // image is loaded; sizes are available
      };

      img.src = reader.result;
      this.setState({
        src: e.target.result
      });
    };
  }
  componentDidMount() {
    this.resumable.assignBrowse(this.input.current);
    this.resumable.on('fileAdded', file => {
      // this.resumable.upload();
      this.setState({
        ready: true,
        value: file.file.name
      });
      if (file.file.type.includes('image')) {
        const { reader } = this.state;

        reader.readAsDataURL(file.file);
      }
    });
  }
  handleCancel = () => {
    this.resumable.cancel();
    this.setState({
      uploading: false,
      ready: false,
      progress: 0
    });
  };
  handlePause = () => {
    this.resumable.pause();
  };
  handleResume = () => {
    this.resumable.upload();
    this.__getProgress();
  };
  handleUpload = () => {
    this.resumable.upload();
    this.__getProgress();
  };
  __getProgress = () => {
    this.setState({
      uploading: true,
      interval: setInterval(() => {
        if (this.resumable.isUploading()) {
          return this.setState({
            progress: Math.round(this.resumable.progress() * 1000) / 10
          });
        }
        const { interval } = this.state;
        clearInterval(interval);
        this.setState({
          interval: undefined,
          uploading: false
        });
        if (this.resumable.progress() === 1) {
          this.setState({
            progress: 100
          });
        }
      }, 500)
    });
  };
  // onChange = ev => {
  //   const ready = ev.target.value !== '';
  //   const { reader } = this.state;
  //   this.setState({
  //     src: ev.target.result,
  //     ready
  //   });
  //   if (ready) {
  //     reader.readAsDataURL(this.input.current.files[0]);
  //   }
  // };
  render() {
    const { label, id, name, ...props } = this.props;
    const {
      ready,
      src,
      value,
      progress,
      height,
      width,
      uploading
    } = this.state;
    return (
      <React.Fragment>
        <label htmlFor={id}>{label}</label>
        <div>
          {ready &&
            src && (
              <div>
                <Img src={src} alt="upload_image" />
              </div>
            )}
          <span ref={this.input} {...props} id={id}>
            Upload
          </span>
          <input name={name} hidden readOnly value={value} />
          <input name="height" type="number" hidden readOnly value={height} />
          <input name="width" type="number" hidden readOnly value={width} />
          <Progress progress={progress} />
          {ready && !uploading && !progress ? (
            <button onClick={this.handleUpload} type="button">
              Upload
            </button>
          ) : null}
          {!uploading && progress ? (
            <button type="button" onClick={this.handleResume}>
              Resume
            </button>
          ) : null}
          {uploading && (
            <button type="button" onClick={this.handlePause}>
              Pause
            </button>
          )}
          {uploading || progress ? (
            <button type="button" onClick={this.handleCancel}>
              Cancel
            </button>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default TextInput;
