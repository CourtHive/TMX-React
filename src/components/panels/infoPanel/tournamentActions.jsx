import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { exportFx } from 'services/files/exportFx';

import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import TMXIconButton from 'components/buttons/TMXIconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { Grid } from '@material-ui/core/';

import { deleteTournamentRecord } from 'services/storage/deleteTournamentRecord';
import { useStyles } from 'components/panels/infoPanel/style';
import { env } from 'config/defaults';

export function TournamentActions(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();

  const { tournamentRecord } = props;
  const { unifiedTournamentId } = tournamentRecord || {};
  const tournamentId = tournamentRecord?.tournamentId || unifiedTournamentId?.tournamentId;

  const editState = useSelector((state) => state.tmx.editState);

  const mobile = env.device.isMobile || env.device.isIpad || env.device.isTablet;

  function requestDeleteTournament() {
    deleteTournamentRecord({
      tournamentId: tournamentId,
      onDelete: () => {
        history.push('/');
      }
    });
  }
  function exportTournamentRecord() {
    const filename = `${tournamentId}.json`;
    exportFx.downloadJSON(filename, tournamentRecord);
  }
  function exportTODSTournamentRecord() {
    const filename = `${tournamentId}.tods.json`;
    console.log({ filename });
  }

  function uploadTournamentRecord() {
    //
  }

  return (
    <>
      <Grid container direction="row" justify="flex-start">
        {!editState ? null : (
          <Grid item>
            <TMXIconButton
              id="copyTournamentRecord"
              title={t('Duplicate')}
              onClick={() => console.log('Duplicate')}
              className={classes.iconMargin}
              icon={<FileCopyIcon />}
            />
          </Grid>
        )}
        {!editState || mobile ? null : (
          <>
            <Grid item>
              <TMXIconButton
                id="exportTournamentRecord"
                title={t('Export Classic')}
                onClick={exportTournamentRecord}
                className={classes.iconMargin}
                icon={<GetAppIcon />}
              />
            </Grid>
            <Grid item>
              <TMXIconButton
                id="exportTournamentRecord"
                title={t('Export TODS')}
                onClick={exportTODSTournamentRecord}
                className={classes.iconMargin}
                icon={<GetAppIcon />}
              />
            </Grid>
          </>
        )}
        {!editState ? null : (
          <Grid item>
            <TMXIconButton
              id="uploadTournamentRecord"
              title={t('Upload')}
              onClick={uploadTournamentRecord}
              className={classes.iconMargin}
              icon={<CloudUploadIcon />}
            />
          </Grid>
        )}
        {!editState ? null : (
          <Grid item>
            <TMXIconButton
              id="deleteTournamentRecord"
              title={t('delete')}
              onClick={requestDeleteTournament}
              className={classes.iconMargin}
              icon={<DeleteIcon />}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
}
