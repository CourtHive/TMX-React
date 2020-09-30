import React, { useEffect, useRef, useState } from 'react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

export function BubbleEditor(props) {
  const { initialValue, onChange, placeholder, setEditor, readOnly } = props;
  const [value, setValue] = useState(initialValue);

  let quill = useRef(null);

  const handleChange = value => {
    setValue(value);
    if (onChange && typeof onChange === 'function') onChange(value);
  }

  useEffect(() => {
    if (setEditor && typeof setEditor === 'function') setEditor(quill);
  }, [setEditor]);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],       // toggled buttons
      ['blockquote', 'code-block'],                    // blocks
      [{ 'header': 1 }, { 'header': 2 }],              // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],    // lists
      [{ 'script': 'sub'}, { 'script': 'super' }],     // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],         // outdent/indent
      [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],       // header dropdown
      [{ 'color': [] }, { 'background': [] }],         // dropdown with defaults
      [{ 'font': [] }],                                // font family
      [{ 'align': [] }],                               // text align
      ['link', 'image', 'video'],
      ['clean'],                                       // remove formatting
    ]
  };

  /*
  const formats = [
    'header', 'font', 'background', 'color', 'code', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'script', 'align', 'direction',
    'link', 'image', 'code-block', 'formula', 'video'
  ];
        formats={formats}
  */

  return (
    <>
      <ReactQuill
        readOnly={readOnly}
        ref={el => { quill = el }}
        style={{width: '100%'}}
        theme="bubble"
        value={value}
        modules={modules}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </>
  );
}
