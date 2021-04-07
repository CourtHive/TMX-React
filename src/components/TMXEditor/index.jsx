import clsx from 'clsx';
import React, { useState } from 'react';
import { Card, CardContent } from '@material-ui/core/';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

import { expandingStyles } from './style';
import { BubbleEditor } from 'components/TMXEditor/bubbleEditor';

export function TMXEditor(props) {
  const { readonly, content, onChange, handleSave } = props;
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  const classes = expandingStyles();

  const newsSplit = content && content.split('</p>');
  const intro = newsSplit && newsSplit.slice(0, 3).join('</p>');
  const paragraphCount = (newsSplit && newsSplit.length) || 0;
  const displayExpand = paragraphCount > 3;

  let quill;
  // function to set reference to editor
  const setEditor = (e) => {
    quill = e;
  };

  /*
  // example of inserting into existing content
  const insertText = () => {
    if (!quill) return;
    let range = quill.getEditorSelection();
    let position = range ? range.index : 0;
    quill.editor.insertText(position, 'Hello, World! ')
  }
  */

  const handleEditMode = () => {
    if (editing) {
      if (handleSave && typeof handleSave === 'function') {
        const text = quill.editor.getText().trim();
        handleSave(text && quill?.value);
      }
    } else {
      setExpanded(true);
    }
    setEditing(!editing);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const ContextIcon = () => {
    return (
      <div className={classes.expand}>
        {!editing && paragraphCount > 3 ? (
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        ) : null}
        {!readonly ? (
          <IconButton className={classes.expand} onClick={handleEditMode} aria-expanded={expanded} aria-label="edit">
            {editing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        ) : null}
      </div>
    );
  };

  const handleOnChange = (newValue) => {
    if (onChange) onChange(newValue);
  };
  const DisplayCard = () => {
    return (
      <>
        {expanded ? (
          <CardContent>
            <BubbleEditor
              readOnly={readonly || !editing}
              onChange={handleOnChange}
              initialValue={content}
              setEditor={setEditor}
              placeholder={'Tournament Notes...'}
            />
          </CardContent>
        ) : (
          <CardContent>
            <BubbleEditor readOnly={true} initialValue={intro} />
          </CardContent>
        )}
        <CardActions disableSpacing>{displayExpand || !readonly ? <ContextIcon /> : ''}</CardActions>
      </>
    );
  };

  return (
    <Card className={classes.card}>
      <DisplayCard />
    </Card>
  );
}

export default TMXEditor;
