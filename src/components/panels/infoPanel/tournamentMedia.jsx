import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { qrFx } from 'services/qrFx';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import EditIcon from '@material-ui/icons/Edit';
import LinkIcon from '@material-ui/icons/Link';
import CropFreeIcon from '@material-ui/icons/CropFree';
import TMXIconButton from 'components/buttons/TMXIconButton';

import { Grid } from '@material-ui/core/';

import { useStyles } from 'components/panels/infoPanel/style';
import { env } from 'config/defaults';

export function TournamentMedia(props) {
  const { t } = useTranslation();
  const classes = useStyles();

  const editState = useSelector((state) => state.tmx.editState);

  const { tournamentRecord } = props;
  const { unifiedTournamentId } = tournamentRecord || {};
  const { tournamentId, organisation } = unifiedTournamentId;

  const orgAbbr = organisation?.organisationAbbreviation || env?.org?.abbr;

  const editImage = () => console.log('Edit Image');

  function openTournamentLink() {
    // TODO: tournamentLink visibility should be dependent on tournament publish status
    // eslint-disable-next-line
    const url = `${location.origin}/t/${tournamentId}`;
    window.open(url, '_blank');
  }

  function showTournamentQR() {
    // eslint-disable-next-line
        const origin = location.origin;
    const tournamentURL = `${origin}/t/${tournamentId}`;
    qrFx.displayQRdialogue(tournamentURL);
  }

  function openOrgLink() {
    if (!orgAbbr) return;
    // eslint-disable-next-line
    const url = `${location.origin}/Live/${orgAbbr}`;
    window.open(url, '_blank');
  }

  function showOrgQR() {
    // eslint-disable-next-line
    const origin = location.origin;
    const orgAbbr = env.org.abbr;
    const orgURL = `${origin}/Live/${orgAbbr}`;
    qrFx.displayQRdialogue(orgURL, tournamentId);
  }

  return (
    <>
      <Grid container justify="center" alignItems="center" alignContent="center" style={{ width: 300, height: '100%' }}>
        <Card className={classes.cardRoot}>
          <CardActionArea onClick={editImage}>
            <CardMedia
              component="img"
              className={classes.media}
              src="https://courthive.com/assets/images/tmx.png"
              title="Tournament Logo"
            />
            <CardContent>
              <Grid container spacing={3} direction="row" justify="flex-end">
                {editState ? <EditIcon /> : null}
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid container direction="row" justify="flex-start">
        {!orgAbbr ? null : (
          <Grid item>
            <TMXIconButton
              id="tournamentLink"
              title={t('phrases.weblink')}
              onClick={openTournamentLink}
              className={classes.iconMargin}
              icon={<LinkIcon />}
            />
          </Grid>
        )}
        <Grid item>
          <TMXIconButton
            id="tournamentQRcode"
            title={t('phrases.qrcode')}
            onClick={showTournamentQR}
            className={classes.iconMargin}
            icon={<CropFreeIcon />}
          />
        </Grid>
        <Grid item>
          <TMXIconButton
            id="weblink"
            title={t('phrases.weblink')}
            onClick={openOrgLink}
            className={classes.iconMargin}
            icon={<LinkIcon />}
          />
        </Grid>
        <Grid item>
          <TMXIconButton
            id="orgQRcode"
            title={t('phrases.qrcode')}
            onClick={showOrgQR}
            className={classes.iconMargin}
            icon={<CropFreeIcon />}
          />
        </Grid>
      </Grid>
      <div className={classes.divider} />
      Media - Sponsors Logos and Social Media Links
    </>
  );
}
