import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { MenuItem, Divider } from '@material-ui/core';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';
import { stringSort } from 'functions/strings';

import { participantRoles, participantTypes } from 'tods-competition-factory';
const { COMPETITOR } = participantRoles;
const { TEAM, GROUP } = participantTypes;

export const TeamSelector = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { onChange } = props;
  const teamContext = props?.teamContext || 'matchUps';
  const selectedTeamId = useSelector((state) => state.tmx.select[teamContext].team);
  const selectedTournamentId = useSelector((state) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state) => state.tmx.records[selectedTournamentId]);
  const tournamentParticipants = tournamentRecord.participants || [];
  const teamParticipants = tournamentParticipants.filter((participant) => {
    return (
      (participant.participantRole === COMPETITOR || !participant.participantRole) &&
      participant.participantType === TEAM
    );
  });
  const groupParticipants = tournamentParticipants.filter((participant) => {
    return (
      (participant.participantRole === COMPETITOR || !participant.participantRole) &&
      participant.participantType === GROUP
    );
  });

  const optionValue = (team) => ({ text: team.participantName, value: team.participantId });
  const teamOptions = teamParticipants.map(optionValue).sort((a, b) => stringSort(a.text, b.text));
  const groupOptions = groupParticipants.map(optionValue).sort((a, b) => stringSort(a.text, b.text));
  if (groupOptions.length) groupOptions.unshift({ divider: true });
  const options = teamOptions.concat(...groupOptions);

  const selectTeam = (event) => {
    const selectedTeamId = event.target.value;
    if (onChange) {
      onChange(selectedTeamId);
    }
    const payload = { selectedTeamId, teamContext };
    dispatch({ type: 'select team', payload });
  };

  return (
    <TMXSelect className={classes.select} value={selectedTeamId} onChange={selectTeam}>
      <MenuItem value="-">
        {' '}
        <em>{t('allteams')}</em>{' '}
      </MenuItem>
      {options.map((t, i) => {
        if (t.divider) return <Divider key={`divider${i}`} />;
        return (
          <MenuItem key={t.value} value={t.value}>
            {' '}
            {t.text}{' '}
          </MenuItem>
        );
      })}
    </TMXSelect>
  );
};
