import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from 'components/buttons/buttonGroups/styles';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { participantRoles, participantTypes, tournamentEngine } from 'tods-competition-factory';
import { PTAB_PARTICIPANTS, PTAB_TEAMS, PTAB_GROUPS, PTAB_OFFICIALS } from 'stores/tmx/types/tabs';

const { INDIVIDUAL, TEAM, GROUP } = participantTypes;
const { COMPETITOR } = participantRoles;

export function ParticipantButtonGroup() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();

  const participantView = useSelector((state) => state.tmx.visible.participantView);

  const { tournamentParticipants } = tournamentEngine.getTournamentParticipants();
  const playersCount = tournamentParticipants.filter((participant) => {
    const isPerson = participant.participantType === INDIVIDUAL || participant.person;
    const isCompetitor = participant.participantRole === COMPETITOR || !participant.participantRole;
    return isPerson && isCompetitor;
  }).length;

  const teamsCount = tournamentParticipants.filter((participant) => {
    return (
      (participant.participantRole === COMPETITOR || !participant.participantRole) &&
      participant.participantType === TEAM
    );
  }).length;

  const groupsCount = tournamentParticipants.filter((participant) => {
    return (
      (participant.participantRole === COMPETITOR || !participant.participantRole) &&
      participant.participantType === GROUP
    );
  }).length;

  const playersLabel = `${t('pyr')} (${playersCount})`;
  const teamsLabel = `${t('tmz')} (${teamsCount})`;
  const groupsLabel = `${t('Groups')} (${groupsCount})`;
  const officialsLabel = 'Officials (0)';

  const handleOnChange = (_, newView) => {
    dispatch({ type: 'set participant view', payload: newView });
  };

  return (
    <ToggleButtonGroup
      value={participantView}
      exclusive
      onChange={handleOnChange}
      aria-label="text alignment"
      style={{ height: 36 }}
    >
      <ToggleButton value={PTAB_PARTICIPANTS} aria-label="draw" className={classes.noWrap}>
        {playersLabel}
      </ToggleButton>
      <ToggleButton value={PTAB_TEAMS} aria-label="competitors" className={classes.noWrap}>
        {teamsLabel}
      </ToggleButton>
      <ToggleButton value={PTAB_GROUPS} aria-label="settings" className={classes.noWrap}>
        {groupsLabel}
      </ToggleButton>
      <ToggleButton value={PTAB_OFFICIALS} aria-label="settings" className={classes.noWrap}>
        {officialsLabel}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
