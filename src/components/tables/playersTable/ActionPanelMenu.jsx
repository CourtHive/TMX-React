import React from 'react';
import { Grid, Typography } from '@material-ui/core/';
import { useStyles } from 'components/tables/styles';
import { useTranslation } from 'react-i18next';

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import GroupIcon from '@material-ui/icons/Group';
import SignInIcon from '@material-ui/icons/EmojiPeople';

import TMXIconButton from 'components/buttons/TMXIconButton';

export const ActionPanelMenu = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    tableData,
    signInOutcome,
    exitSelectionMode,
    activeParticipantRow,
    selectedSignInStatus,
    deleteSelectedParticipants,
    modifyParticipantsSignInState,
    addSelectedParticipantsToGrouping,
  } = props;
  
  const checkedParticipants = tableData.filter((row) => row.checked);
  const activeParticipants = checkedParticipants.find(activeParticipantRow);
  const selectedCount = `${checkedParticipants.length} ${t('Selected')}`;

  return (
    <>
      <Grid container direction="row" justify="space-between">
        <Grid item>
          <Typography variant="h1" className={classes.itemsCount}>
            {selectedCount}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container alignItems="center" direction="row" justify="flex-end">
            {
              selectedSignInStatus === '-' || activeParticipants ? null :
              <TMXIconButton
                id="signInAction"
                className={classes.iconMargin}
                title={signInOutcome ? t('sgi') : t('sgo')}
                onClick={modifyParticipantsSignInState}
                icon={<SignInIcon />}
              />
            }
            <TMXIconButton
              id="addSelectedToGroup"
              title={t('Groupings')}
              className={classes.iconMargin}
              onClick={addSelectedParticipantsToGrouping}
              icon={<GroupIcon />}
            />
            {
              activeParticipants ? null :
              <TMXIconButton
                id="deleteSelected"
                title={t('remove')}
                className={classes.iconMargin}
                onClick={deleteSelectedParticipants}
                icon={<DeleteIcon />}
              />
            }
            <TMXIconButton
              id="exitSelectionMode"
              title={t('Close')}
              className={classes.iconMargin}
              onClick={exitSelectionMode}
              icon={<CloseIcon />}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
