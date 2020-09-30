import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import { matchUpFormatCode } from 'tods-matchup-format-code';

import InputLabel from '@material-ui/core/InputLabel';
import MuiMenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';
import { MatchConfigurationInterface } from 'components/dialogs/scoringDialog/typedefs/scoringTypes';
import SetFormatSelector from 'components/forms/matchUpFormat/SetFormatSelector';
import { useStyles } from 'components/forms/matchUpFormat/style';
import { matchUpFormats } from 'functions/scoring/matchUpFormats';

export interface MatchFormatFormProps {
  disabled?: string[];
  matchFormatParsed: MatchConfigurationInterface;
  onChange: (matchUpFormat: MatchConfigurationInterface) => void;
}

const MatchFormatForm: React.FC<MatchFormatFormProps> = ({ disabled, matchFormatParsed, onChange }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const defaultMatchFormats = matchUpFormats().formats;
  const matchFormatString = matchUpFormatCode.stringify(matchFormatParsed);
  const isNotCustom = defaultMatchFormats.find((defaultMatchFormat) => defaultMatchFormat.format === matchFormatString);
  const [scoringMode, setScoringMode] = useState(isNotCustom ? 'standard' : 'custom');

  const updateMatchUpFormat = (matchUpFormat: MatchConfigurationInterface) => {
    onChange && onChange(matchUpFormat);
  };

  const setsUpdate = (matchUpFormat: MatchConfigurationInterface) => updateMatchUpFormat(matchUpFormat);
  const hasFinalSet = matchFormatParsed && !!matchFormatParsed.finalSetFormat;

  const scoringFormatChanged = (e) => {
    const key = e && e.target && e.target.value;
    const matchUpFormat = defaultMatchFormats.find((defaultMatchFormat) => defaultMatchFormat.key === key)?.format;
    const matchFormatParsed = matchUpFormatCode.parse(matchUpFormat) as MatchConfigurationInterface;
    if (matchUpFormat) {
      setScoringMode('standard');
      updateMatchUpFormat(matchFormatParsed);
    } else {
      setScoringMode('custom');
    }
  };

  const activeMatchFormat = () => {
    if (scoringMode === 'custom') return 'custom';
    return (
      defaultMatchFormats.reduce<string>(
        (p, c) => (c.format === matchUpFormatCode.stringify(matchFormatParsed) ? c.key : p),
        undefined
      ) || 'standard'
    );
  };

  const renderCustomScoring = () => {
    if (scoringMode !== 'custom') return null;
    return (
      <>
        <Grid container direction="row" justify="flex-start" className={classes.row}>
          <Grid item>
            <SetFormatSelector
              matchFormatParsed={matchFormatParsed}
              disabled={disabled}
              onChange={setsUpdate}
              hasFinalSet={hasFinalSet}
            />
            {!hasFinalSet || matchFormatParsed.timed ? null : (
              <SetFormatSelector
                matchFormatParsed={matchFormatParsed}
                disabled={disabled}
                isFinalSet={true}
                onChange={setsUpdate}
                hasFinalSet={hasFinalSet}
              />
            )}
          </Grid>
        </Grid>
      </>
    );
  };

  function renderMatchFormat(f) {
    return (
      <MuiMenuItem key={f.key} value={f.key}>
        <ul className={classes.matchFormatList}>
          <li className={classes.matchUpFormat}>{f.name}</li>
          {f.desc ? (
            <li key={`${f.key}_1`} style={{ fontSize: 10 }}>
              {f.desc}
            </li>
          ) : (
            ''
          )}
          {f.desc2 ? (
            <li key={`${f.key}_2`} style={{ fontSize: 10 }}>
              {f.desc2}
            </li>
          ) : (
            ''
          )}
        </ul>
      </MuiMenuItem>
    );
  }

  const renderPreDefinedScoring = () => {
    return (
      <>
        <FormControl style={{ minWidth: 120, width: '100%', margin: 0, padding: 0 }}>
          <InputLabel>{t('scoring.label')}</InputLabel>
          <MuiSelect value={activeMatchFormat()} onChange={scoringFormatChanged}>
            {defaultMatchFormats.map(renderMatchFormat)}
          </MuiSelect>
        </FormControl>
      </>
    );
  };

  return (
    <>
      <Grid container direction="row" justify="flex-start" className={classes.row}>
        <Grid item className={classes.minimums}>
          {renderPreDefinedScoring()}
        </Grid>
      </Grid>
      {renderCustomScoring()}
    </>
  );
};

export default MatchFormatForm;
