import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStyles } from 'components/tables/styles';
import { useSelector } from 'react-redux';

import SyncIcon from '@material-ui/icons/Sync';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import DoneIcon from '@material-ui/icons/AssignmentTurnedInTwoTone';

import TMXIconButton from 'components/buttons/TMXIconButton';

import { synchronizePlayers } from 'components/tables/participantsTable/synchronizePlayers';

export const IconButtonGroup = (props) => {
  const { editMode } = props;

  return <>{editMode ? <EditingButtonGroup {...props} /> : <NotEditingButtonGroup {...props} />}</>;
};

export const NotEditingButtonGroup = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const editState = useSelector((state) => state.tmx.editState);

  const { columnMenuItems, addParticipant, editModeAction } = props;

  return (
    <>
      <TMXIconButton
        className={editState && classes.iconMargin}
        id="viewColumns"
        title={t('Show Columns')}
        menuItems={columnMenuItems}
        icon={<ViewColumnIcon />}
      />
      {!editState ? null : (
        <TMXIconButton
          id="addPerson"
          title={t('actions.add_player')}
          onClick={addParticipant}
          className={classes.iconMargin}
          icon={<PersonAddIcon />}
        />
      )}
      {!editState ? null : (
        <TMXIconButton id="moreOptionsMode" onClick={editModeAction} title={t('More')} icon={<MoreVertIcon />} />
      )}
    </>
  );
};

export const EditingButtonGroup = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { editModeAction } = props;

  const syncMenuItems = [
    {
      id: 'synchronizePlayers',
      text: t('requests.syncPlayers'),
      onClick: synchronizePlayers,
      className: 'syncPlayers'
    }
  ];

  return (
    <>
      <TMXIconButton
        id="syncParticipants"
        title={t('requests.syncPlayers')}
        menuItems={syncMenuItems}
        className={classes.iconMargin}
        icon={<SyncIcon />}
      />
      <TMXIconButton
        title={t('Done')}
        id="doneEditingParticipants"
        className="doneEditingEventParticipants"
        onClick={editModeAction}
        icon={<DoneIcon />}
      />
    </>
  );
};
