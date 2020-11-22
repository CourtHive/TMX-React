import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

import { PTAB_PARTICIPANTS, PTAB_TEAMS, PTAB_GROUPS, PTAB_OFFICIALS } from 'stores/tmx/types/tabs';

import { participantRoles, participantTypes } from 'tods-competition-factory';
const { COMPETITOR } = participantRoles;
const { INDIVIDUAL, TEAM, GROUP } = participantTypes;

export const ParticipantView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const participantView = useSelector((state: any) => state.tmx.visible.participantView);
  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);
  const tournamentParticipants = tournamentRecord.participants || [];

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

  const handleOnChange = (event) => {
    const newView = event.target.value;
    dispatch({ type: 'set participant view', payload: newView });
  };

  const options = [
    { text: playersLabel, value: PTAB_PARTICIPANTS },
    { text: teamsLabel, value: PTAB_TEAMS },
    { text: groupsLabel, value: PTAB_GROUPS },
    { text: officialsLabel, value: PTAB_OFFICIALS }
  ];

  const Selector = () => (
    <TMXSelect className={classes.select} value={participantView} onChange={handleOnChange}>
      {options.map((t) => (
        <MenuItem key={t.text} value={t.value}>
          {t.text}
        </MenuItem>
      ))}
    </TMXSelect>
  );
  return <Selector />;
};
