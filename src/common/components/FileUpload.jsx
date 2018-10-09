/* env browser */
import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import Progress from './Progress';

// const Img = styled.img`
//   max-width: 300px;
//   height: auto;
// `;

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chunkNumber: 0
    };
  }
  componentDidMount() {
    this.reader = new FileReader();
  }

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
        ).then(res => res.json());
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
      uploadToken: undefined
    });
  };
  asyncSetState = state =>
    new Promise(resolve => this.setState({ ...state }, resolve));
  sendFile = async blob => {
    const { uploadToken, chunkNumber } = this.state;
    const chunk = await this.provideBase64(blob);
    if (!chunk) return this.cleanUpUpload();
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
    }).then(res => res.json());
    return response;
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
    await this.getToken();
    for (let i = 0, limit = chunkSize; file.size > i; ) {
      const { chunkNumber } = this.state;
      const blob = file.slice(i, limit);
      await this.asyncSetState({ chunkNumber: chunkNumber + 1 });
      await this.sendFile(blob);
      i = i + chunkSize;
      limit = limit + chunkSize;
    }
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
    return (
      <React.Fragment>
        <label htmlFor={id}>{label}</label>
        <div>
          <input type="file" name={name} onChange={this.onChange} />
        </div>
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
