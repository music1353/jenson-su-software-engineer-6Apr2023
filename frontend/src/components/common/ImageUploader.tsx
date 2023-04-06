import React from 'react';
import { FileImageOutlined } from '@ant-design/icons';

interface Props {
  imageUri: string | null;
  editable: boolean;
  errorCallback?: (err: string) => void;
  updatedCallback?: (file: File) => void;
}

const EmptyImage: React.FC = () => {
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    fontSize: '1.2rem',
    color: '#878787',
    backgroud: '#fafafa'
  }
  
  return (
    <div style={style}>
      <FileImageOutlined />
    </div>
  )
}

const ImageUploader: React.FC<Props> = ({ imageUri, editable, errorCallback, updatedCallback }) => {
  const VALID_SIZE = 1;
  const _valid_file_size = (file: File) => {
    let fileMB = file.size / 1024 / 1024;
    if (fileMB >= VALID_SIZE) {
      return false
    }
    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (!_valid_file_size(file)) {
        const errMsg = `Upload file error. The file should not exceed ${VALID_SIZE} MB.`;
        if (errorCallback) {
          errorCallback(errMsg);
        }
        return
      }
      
      if (updatedCallback) {
        updatedCallback(file);
      }
    }
  }

  return (
    <div className={`image-uploader ${ editable ? "uploader--editable" : "" }`}>
      {
        imageUri ?
          <img className="upload__image" src={imageUri} alt="img-alt" /> : <EmptyImage />
      }

      {
        editable && (
          <>
            <input
              onChange={handleFileChange}
              className="upload__input"
              type="file"
              accept="image/*"
            />
            <img
              className='upload__icon'
              src={require('assets/images/icons/pencil.png')}
              alt="icon-img"
            />
          </>
        )
      }
    </div>
  )
}

export default ImageUploader;