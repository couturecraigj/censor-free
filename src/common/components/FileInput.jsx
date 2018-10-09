import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Resumable from 'resumablejs';
import Progress from './Progress';

const Img = styled.img`
  max-width: 300px;
  height: auto;
`;

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    const reader = new FileReader();
    this.state = {
      ready: false,
      uploading: false,
      reader,
      progress: 0,
      value: '',
      height: '',
      width: ''
    };
    this.resumable = new Resumable({
      target: '/files',
      query: {
        upload_token: 'my_token'
      },
      prioritizeFirstAndLastChunk: true
    });
    this.video = React.createRef();
    this.input = React.createRef();
    reader.onload = e => {
      if (!this.isAcceptableFile(e.target.result)) {
        return this.setState({
          error: 'File Type Unaccepted'
        });
      }
      if (this.isImage()) {
        const img = new Image();

        img.onload = () => {
          this.setState({
            width: +img.width,
            height: +img.height
          });
        };
        this.setState({
          src: e.target.result
        });
        img.src = reader.result;
      }
      if (this.isVideo()) {
        const { url } = this.state;
        this.video.current.src = url;
        this.video.current.play();
      }
    };
  }
  componentDidMount() {
    this.resumable.assignBrowse(this.input.current);
    this.resumable.on('fileAdded', file => {
      if (!this.isAcceptableFile(file.file.type)) {
        return this.setState({
          error: 'File Type Unaccepted'
        });
      }
      // this.resumable.upload();
      this.setState({
        ready: true,
        value: file.file.name,
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        url: URL.createObjectURL(file.file),
        error: ''
      });
      const { reader } = this.state;

      reader.readAsDataURL(file.file);
    });
    // eslint-disable-next-line no-console
    this.resumable.on('error', console.error);
    // eslint-disable-next-line no-console
    this.resumable.on('chunkingStart', console.log);
  }
  isAcceptableFile = dataUrl => {
    const { accept } = this.props;
    const mimeType = dataUrl.replace(/data:(.[^;]*).*/, '$1');

    return (
      accept
        .split(',')
        .some(string => string.toLowerCase() === mimeType.toLowerCase()) ||
      mimeType.includes(accept.replace('*', ''))
    );
  };

  isImage = () => {
    const { accept } = this.props;
    return accept.toLowerCase().includes('image');
  };
  isVideo = () => {
    const { accept } = this.props;
    return accept.toLowerCase().includes('video');
  };

  handleCancel = () => {
    this.resumable.cancel();
    this.setState({
      uploading: false,
      ready: false,
      progress: 0,
      finished: false
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
            progress: 100,
            finished: true
          });
        }
      }, 500)
    });
  };

  getUploadInner = () => {
    const { label } = this.props;
    const { ready, src, finished } = this.state;
    if (finished) return null;
    if (ready && src && this.isImage())
      return (
        <div>
          <Img src={src} alt="upload_image" />
        </div>
      );
    return `Choose the ${label} you want to upload`;
  };

  getDisplay = () => {
    const { id } = this.props;
    const { src, finished } = this.state;
    if (finished && this.isImage())
      return (
        <div className="upload-button" id={id}>
          <div>
            <Img src={src} alt="upload_image" />
          </div>
        </div>
      );

    return null;
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
      mimeType,
      value,
      url,
      error,
      progress,
      finished,
      height,
      width,
      uploading
      // file
    } = this.state;
    return (
      <React.Fragment>
        <label htmlFor={id}>{label}</label>
        <div>
          <div
            ref={this.input}
            className={!finished && 'upload-button'}
            {...props}
            id={id}
          >
            {this.getUploadInner()}
          </div>
          <video
            ref={this.video}
            hidden={!(this.isVideo() && ready)}
            muted
            width="400"
            controls
          >
            <source src={url || ''} type={mimeType} />
            Your browser does not support HTML5 video.
            <track kind="captions" />
          </video>
          {this.getDisplay()}
          <input name={name} hidden readOnly value={value} />
          <input name="height" type="number" hidden readOnly value={height} />
          <input name="width" type="number" hidden readOnly value={width} />
          {error}
          {ready && <Progress progress={progress} />}
          {ready && !uploading && !progress ? (
            <button onClick={this.handleUpload} type="button">
              Upload
            </button>
          ) : null}
          {!uploading && progress && !finished ? (
            <button type="button" onClick={this.handleResume}>
              Resume
            </button>
          ) : null}
          {uploading &&
            !finished && (
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

FileInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default FileInput;
