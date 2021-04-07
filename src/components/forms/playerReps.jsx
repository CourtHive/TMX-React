import React, { useState } from 'react';
import { normalizeName } from 'normalize-text';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';

import { MultiComboBox } from './multComboBox';

export function SelectReps(props) {
  const { onCancel, existingReps, drawPlayers, callback } = props;

  const representativeItem = (participant) => {
    const person = participant.person;
    const { participantId } = participant;
    const personName = person && normalizeName(`${person.standardGivenName} ${person.standardFamilyName}`);
    const title = person?.otherName || personName;
    return { title, participantId };
  };
  const options = drawPlayers.filter((participant) => participant.person).map(representativeItem);

  const onClose = (representatives) => {
    if (representatives && callback && typeof callback === 'function') {
      callback(representatives);
    }
  };

  const initialValues = { options, representatives: existingReps.map(representativeItem) };
  return <PlayerRepSelection onClose={onClose} onCancel={onCancel} initialValues={initialValues} />;
}

export const PlayerRepSelection = ({ onClose, onCancel, initialValues }) => {
  const { t } = useTranslation();
  const defaultValues = {
    options: [],
    representatives: [],
    promptActive: true,
    label: `${t('draws.playerreps')}...`,
    title: t('draws.playerreps'),
    prompt: `${t('select')}...`,
    noOptionsText: t('none')
  };
  const [values, setValues] = useState(Object.assign(defaultValues, initialValues));

  values.promptActive = values.representatives.length < 2 ? true : false;

  const cancelAction = () => {
    if (onCancel && typeof onCancel === 'function') onCancel();
  };
  const handleClose = () => {
    if (onClose && typeof onClose === 'function') onClose(values.representatives);
  };
  const repNames = (evt, selections) => {
    const representatives = selections.map((s) => (typeof s === 'string' ? { title: s } : s));
    setValues({ ...values, representatives });
  };
  return (
    <Dialog disableBackdropClick={false} open={true} maxWidth={'md'} onClose={cancelAction}>
      <DialogTitle>
        <div style={{ minWidth: 400 }}>{values.title}</div>
      </DialogTitle>
      <DialogContent>
        <MultiComboBox
          onChange={repNames}
          label={values.label}
          prompt={values.prompt}
          options={values.options}
          className={'selectPlayerReps'}
          promptActive={values.promptActive}
          noOptionsText={values.noOptionsText}
          selections={values.representatives}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelAction} color="secondary" variant="outlined">
          {' '}
          {t('ccl')}{' '}
        </Button>
        <Button onClick={handleClose} color="primary" variant="outlined">
          {' '}
          {t('save')}{' '}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
