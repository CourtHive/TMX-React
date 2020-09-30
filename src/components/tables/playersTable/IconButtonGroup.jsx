import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStyles } from 'components/tables/styles';
import { useSelector } from 'react-redux';

import { env } from 'config/defaults';
import { tmxStore } from 'stores/tmxStore';
import { getTournamentRecord } from 'stores/accessor';
import { coms } from 'services/communications/SocketIo/coms';

import SyncIcon from '@material-ui/icons/Sync';
import SendIcon from '@material-ui/icons/Send';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import DoneIcon from '@material-ui/icons/AssignmentTurnedInTwoTone';

import TMXIconButton from 'components/buttons/TMXIconButton';

import { editRegistrationLink } from 'components/tables/playersTable/editRegistrationLink';
import { synchronizePlayers } from 'components/tables/playersTable/synchronizePlayers';

function setParticipantsRetrievalKey() {
  const uidate = new Date().getTime();
  const keyUUID = uidate.toString(36).slice(-6).toUpperCase();
  const tournamentRecord = getTournamentRecord();
  const payload = {
    key_uuid: keyUUID,
    content: {
      key: true,
      onetime: false,
      directive: 'sendKey',
      content: {
        data: JSON.stringify(tournamentRecord.participants)
      }
    }
  };

  coms.emitTmx({ action: 'pushKey', payload }, displayKey);

  function displayKey() {
    tmxStore.dispatch({
      type: 'alert dialog',
      payload: {
        title: 'Retrieval Key',
        content: keyUUID
      }
    });
  }
}

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

  const { editModeAction, tournamentProfile } = props;

  const syncMenuItems = [
    {
      id: 'regLink',
      text: t('signin.reglink'),
      onClick: () => editRegistrationLink({ tournamentProfile }),
      className: 'regLink'
    },
    {
      id: 'synchronizePlayers',
      text: t('requests.syncPlayers'),
      onClick: synchronizePlayers,
      className: 'syncPlayers'
    }
  ];

  return (
    <>
      {env.org?.abbr !== 'ITA' ? null : (
        <TMXIconButton
          id="setParticipantsRetrievalKey"
          title={t('Send Participants')}
          className={classes.iconMargin}
          onClick={setParticipantsRetrievalKey}
          icon={<SendIcon />}
        />
      )}
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
