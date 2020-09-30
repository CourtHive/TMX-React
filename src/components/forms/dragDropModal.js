import React from 'react';

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

import { tmxStore } from 'stores/tmxStore';
import i18n from "i18next";

export function dropModal({callback, dropzoneText, dropzoneReject, accept} = {}) {
    let content = () =>
        <div style={{width: 400, marginLeft: '3em', marginRight: '3em'}}>
            <DropAccept
                callback={handleCallback}
                dropzoneText={dropzoneText}
                dropzoneReject={dropzoneReject}
                accept={accept}
            />
        </div>
            
    tmxStore.dispatch({
     type: 'alert dialog',
     payload: {
        title: i18n.t('phrases.importdata'),
        okTitle: i18n.t('Close'),
        render: content
     }
    });

    function handleCallback(result) {
        tmxStore.dispatch({ type: 'alert dialog' });
        callback(result);
    }
}

const DropAccept = ({callback, dropzoneText, dropzoneReject, accept}={}) => {
    const handleChangeStatus = ({ meta, file }, status) => {
        if (status === 'done') {
            if (callback && typeof callback === 'function') callback(file);
        } else if (status === 'aborted') {
            console.log(`${meta.name}, upload failed...`)
        }
    }

    const getInputLabel = (files, extra) => extra.reject ? { color: 'red' } : {};
    const getInputContent = (files, extra) => {
        let willreject = dropzoneReject || 'JSON files only';
        let acceptable = dropzoneText || i18n.t('phrases.draganddrop');
        return extra.reject ? willreject : acceptable ;
    }
  
    return (
      <Dropzone
        autoUpload={false}
        maxFiles={1}
        multiple={false}
        canCancel={false}
        onChangeStatus={handleChangeStatus}
        accept={accept || "application/json"}
        inputContent={getInputContent}
        styles={{
            // dropzone: { width: 400, height: 200 },
            dropzoneActive: { borderColor: 'green' },
            dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
            inputLabel: getInputLabel,
        }}
      />
    )
  }