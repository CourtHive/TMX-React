import { db } from 'services/storage/db';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

import { env } from 'config/defaults';
import { stringSort } from 'functions/strings';
import { coms } from 'services/communications/SocketIo/coms';

import { Grid, Typography } from '@material-ui/core/';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useStyles } from './styles';

import { IdiomSelector } from 'services/idiomManager';

function KeyEntry() {
  const { t } = useTranslation();
  const [keyOptions, setKeyOptions] = useState([]);

  const onChange = (_, selection) => {
    if (selection && selection.key) {
      coms.sendKey(selection.key.trim());
    } else if (selection.trim()) {
      coms.sendKey(selection.trim());
    }
  }

  useEffect(() => {
    db.findSetting('keys').then(setting => {
      const existingKeys = setting && setting.keys
        .sort(stringSort)
        .map(key => {
          return { title: key.description, key: key.keyid };
        });
      if (existingKeys) setKeyOptions(existingKeys)

    }, ()=>{});
  }, []);

  const handleGetOptionLabel = (option) => {
    return option?.title || '';
  };

  return (
    <div style={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id="key-entry"
        options={keyOptions}
        autoComplete={true}
        onChange={onChange}
        getOptionLabel={handleGetOptionLabel}
        renderInput={(params) => (
          <TextField {...params} label={t('Key')} placeholder={t('Select or enter key')} margin="normal" />
        )}
      />
    </div>
  );
}

export const SettingsPanel = () => {
    const { t } = useTranslation();
    const classes = useStyles();

  return (
    <div className={classes.settingsPanelContainer}>
      <Typography variant="h1" className={classes.sectionTitle}>
          {t('TMX Version')} {env.version}
      </Typography>
      <Grid container direction="column" spacing={2} justify="flex-start" style={{maxWidth: 300}}>
        <Grid item>
          <IdiomSelector />
        </Grid>
        <Grid item>
          <KeyEntry />
        </Grid>
      </Grid>
    </div>
  );
};
