/* env browser */
import React from 'react';
import PropTypes from 'prop-types';
import { Field, ErrorMessage } from 'formik';
import styled, { css } from 'styled-components';
import Progress from './Progress';

const Button = styled.label`
  text-align: center;
  width: 100%;
  height: auto;
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #aaa;
  border: 1px solid #999;
  ${props =>
    !props.loading
      ? css`
          padding-top: 0.5em;
          padding-bottom: 0.5em;
        `
      : css`
          height: 2em;
        `} border-radius: 0.3em;
  width: 100%;
  /* height: auto; */
`;

/**
 * TODO: Make it so that a user can give a URL where an image is located instead of loading the file manually
 */
class FileUpload extends React.Component {
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
      const { finished } = this.state;

      if (finished) {
        return this.sendValue();
      }

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

      this.sendValue();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    await this.cleanUpUpload();
  };
  // eslint-disable-next-line react/destructuring-assignment
  sendValue = value => {
    const { uploadToken } = this.state;

    if (typeof value === 'undefined') value = uploadToken;

    const { onChange, onBlur, name } = this.props;

    if (onChange) {
      onChange({ target: { name, value } });
      onBlur({ target: { name, value } });
    }
  };
  onBlur = e => {
    e.preventDefault();
    e.persist();

    const { onBlur } = this.props;

    if (onBlur) {
      onBlur({
        type: 'blur',
        target: e.target.control
      });
    }
  };
  onChange = async e => {
    e.preventDefault();
    e.persist();

    if (!e.target.files[0]) {
      const { onChange, name } = this.props;

      if (onChange) {
        onChange({ target: { name, value: '' } });
      }

      return;
    }

    const [file] = [...e.target.files];

    this.sendValue('');

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
    const { label, id, name, accept, onBlur } = this.props;
    const { progress } = this.state;

    return (
      <Div loading={progress > 0 && progress < 100}>
        <Button htmlFor={id} onBlur={this.onBlur} tabIndex="0">
          {label}
          <input
            accept={accept}
            type="file"
            id={id}
            hidden
            name={name}
            onBlur={onBlur}
            // readOnly
            onChange={this.onChange}
          />
          {progress ? <Progress progress={progress} /> : null}
        </Button>
      </Div>
    );
  }
}

FileUpload.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  // onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default FileUpload;

export const FormikFileUpload = ({ name, ...props }) => (
  <div>
    <Field name={name}>
      {({ field }) => <FileUpload {...props} {...field} />}
    </Field>
    <ErrorMessage name={name} />
  </div>
);

FormikFileUpload.propTypes = {
  name: PropTypes.string.isRequired
};
