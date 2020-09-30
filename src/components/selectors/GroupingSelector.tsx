import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { MenuItem, Divider } from '@material-ui/core';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';
import { stringSort } from 'functions/strings';

import { participantRoles, participantTypes } from 'tods-competition-factory';
const { COMPETITOR } = participantRoles;
const { TEAM, GROUP } = participantTypes;

export const GroupingSelector = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { groupingParticipantId, onChange } = props;
  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);
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

  const optionValue = (team) => ({ text: team.name, value: team.participantId });
  const teamOptions = teamParticipants.map(optionValue).sort((a, b) => stringSort(a.text, b.text));
  const groupOptions = groupParticipants.map(optionValue).sort((a, b) => stringSort(a.text, b.text));
  if (groupOptions.length) groupOptions.unshift({ divider: true });
  const options = teamOptions.concat(...groupOptions);

  const selectTeam = (event) => {
    const value = event.target.value;
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <TMXSelect className={classes.select} value={groupingParticipantId} onChange={selectTeam}>
      <MenuItem value="-">
        {' '}
        <em>{t('none')}</em>{' '}
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
