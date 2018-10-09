/* env browser */
import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import Progress from './Progress';

// const Img = styled.img`
//   max-width: 300px;
//   height: auto;
// `;

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chunkNumber: 0,
      progress: 0
    };
  }
  componentDidMount() {
    this.reader = new FileReader();
  }
  processError = async res => {
    if (res.status > 299) throw new Error((await res.json()).message);
    return res.json();
  };

  getToken = () => {
    const {
      height,
      width,
      mimeType,
      originalFileName,
      chunkSize,
      size
    } = this.state;
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `/api/upload?json=${encodeURIComponent(
            JSON.stringify({
              height,
              width,
              mimeType,
              originalFileName,
              chunkSize,
              size
            })
          )}`
        ).then(this.processError);
        // console.log(response);
        this.setState(
          {
            ...response
          },
          () => {
            resolve(response);
          }
        );
      } catch (e) {
        return reject(e);
      }
    });
  };
  cleanUpUpload = async () => {
    this.setState({
      uploadToken: undefined,
      chunkNumber: 0,
      progress: 0
    });
  };
  asyncSetState = state =>
    new Promise(resolve => this.setState({ ...state }, resolve));
  sendFile = async blob => {
    const { uploadToken, chunkNumber } = this.state;
    const chunk = await this.provideBase64(blob);
    try {
      const response = await fetch(`/api/upload`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uploadToken,
          chunk,
          chunkNumber
        })
      }).then(this.processError);

      return response;
    } catch (error) {
      throw error;
    }
  };
  getDimensionsOfImage = file =>
    new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.onload = () => {
          this.setState(
            {
              height: img.height,
              width: img.width
            },
            resolve
          );
        };
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        img.src = URL.createObjectURL(file);
      } catch (e) {
        reject(e);
      }
    });
  provideBase64 = async blob =>
    new Promise(resolve => {
      this.reader.onload = async () => {
        resolve(this.reader.result.replace(/^data:[\w/-]*;base64,/gm, ''));
      };
      this.reader.readAsDataURL(blob);
    });
  processFile = async file => {
    const { chunkSize } = this.state;
    try {
      await this.getToken();
      for (let i = 0, limit = chunkSize; file.size > i; ) {
        const { chunkNumber, size } = this.state;
        const blob = file.slice(i, limit);
        const progress = (((chunkNumber + 1) * chunkSize) / size) * 100;
        await this.asyncSetState({
          chunkNumber: chunkNumber + 1,
          progress: progress > 100 ? 100 : progress
        });
        try {
          await this.sendFile(blob);
        } catch (error) {
          if (error.message.toLowerCase().includes('finished')) break;
        }
        i = i + chunkSize;
        limit = limit + chunkSize;
      }
    } catch (error) {
      console.error(error);
    }
    await this.cleanUpUpload();
  };
  onChange = async e => {
    e.preventDefault();
    if (!e.target.files[0]) return;
    const [file] = [...e.target.files];
    if (file.type.startsWith('image')) await this.getDimensionsOfImage(file);
    const chunkSize = 50000;
    await this.asyncSetState({
      mimeType: file.type,
      originalFileName: file.name,
      chunkSize,
      size: file.size
    });
    setTimeout(async () => {
      await this.processFile(file);
    }, 1);

    // console.log(file);
  };
  render() {
    const { label, id, name } = this.props;
    const { progress } = this.state;
    return (
      <React.Fragment>
        <label htmlFor={id}>
          {label}
          <div>
            <input
              type="file"
              id={id}
              hidden
              name={name}
              onChange={this.onChange}
            />
          </div>
          {progress && <Progress progress={progress} />}
        </label>
      </React.Fragment>
    );
  }
}

FileInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  // accept: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default FileInput;
