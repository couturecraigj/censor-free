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
      blobs: [],
      base64s: []
    };
  }
  componentDidMount() {
    this.reader = new FileReader();
    this.reader.onload = async () => {
      const { base64s } = this.state;
      this.setState({
        base64s: [
          ...base64s,
          this.reader.result.replace(/^data:[\w/-]*;base64,/gm, '')
        ]
      });
      this.readFiles();
    };
  }
  readFiles = async () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.uploadToken) await this.getToken();
    // eslint-disable-next-line react/destructuring-assignment
    const [blob, ...blobs] = this.state.blobs;
    this.setState({
      blobs
    });
    if (blob) this.reader.readAsDataURL(blob);
    else {
      const { base64s, type } = this.state;
      // console.log(base64s);
      // console.log(type);
      this.setState(
        {
          chunks: []
        },
        () => {
          this.sendFiles();
        }
      );
    }
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
  sendFiles = async () => {
    const {
      uploadToken,
      base64s: [chunk, ...base64s],
      chunks
    } = this.state;
    this.setState(
      {
        chunk,
        base64s,
        chunks: [...chunks, chunk]
      },
      async () => {
        const { chunk, chunks, base64s } = this.state;
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
            chunkNumber: chunks.length
          })
        }).then(res => res.json());
        await this.sendFiles();
        return response;
      }
    );
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
  onChange = async e => {
    e.preventDefault();
    if (!e.target.files[0]) return;
    const [file] = [...e.target.files];
    if (file.type.startsWith('image')) await this.getDimensionsOfImage(file);
    const blobs = [];
    const chunkSize = 10000;
    this.setState({
      chunkSize
    });
    for (let i = 0, limit = chunkSize; file.size > i; ) {
      const blob = file.slice(i, limit);

      blobs.push(blob);
      i = i + chunkSize;
      limit = limit + chunkSize;
    }
    // console.log(file);
    this.setState(
      {
        blobs,
        mimeType: file.type,
        originalFileName: file.name,
        size: file.size
      },
      () => {
        this.readFiles();
      }
    );
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
