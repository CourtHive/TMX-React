import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { TMXEditor } from 'components/TMXEditor';

import { Typography } from '@material-ui/core/';
import { useStyles } from 'components/panels/infoPanel/style';

export function TournamentNotes(props) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { tournamentRecord } = props;
  const editState = useSelector((state) => state.tmx.editState);

  let notes = tournamentRecord.notes || '';

  const handleSave = (value) => {
    dispatch({
      type: 'tournamentEngine',
      payload: { methods: [{ method: 'setTournamentNotes', params: { notes: value } }] }
    });
  };

  return (
    <>
      <div style={{ maxWidth: 1200 }}>
        <Typography variant="h1" className={classes.sectionTitle}>
          Notes
        </Typography>
        <TMXEditor handleSave={handleSave} content={notes} readonly={!editState} />
      </div>
    </>
  );
}
