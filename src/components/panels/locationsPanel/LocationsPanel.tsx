import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from 'components/panels/styles';

import { Breadcrumbs, Grid, Link } from '@material-ui/core';
import { LocationSelector } from 'components/selectors/LocationSelector';
import { LocationsTable } from 'components/tables/locationsTable/LocationsTable';
import { LocationOptions } from 'components/forms/editLocation/locationOptions';
import { LocationOverview } from 'components/forms/editLocation/locationOverview';
import { LocationCourts } from 'components/forms/editLocation/locationCourts';
import { LocationMedia } from 'components/forms/editLocation/locationMedia';

// import { tournamentEngine } from 'competitionFactory';
import { tournamentEngine } from 'tods-competition-factory';

export const LocationsPanel = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const locationView = useSelector((state: any) => state.tmx.visible.locationView);
  const selectedVenueId = useSelector((state: any) => state.tmx.select.venues.venue);
  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);

  const { venues } = tournamentEngine.setState(tournamentRecord).getVenues() || [];
  const selectedLocation = venues.find((venue) => venue.venueId === selectedVenueId);

  const clearLocationSelection = () => {
    dispatch({ type: 'select venue' });
  };

  const locationsCount = `${t('All Locations')} (${venues.length})`;

  return (
    <>
      <Grid container spacing={1} direction="row" justify="flex-start">
        <Grid item>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="primary" onClick={clearLocationSelection} className={classes.link}>
              {locationsCount}
            </Link>
            {selectedLocation && <LocationSelector venues={venues} selectedVenueId={selectedVenueId} />}
          </Breadcrumbs>
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <Grid container direction="row" item justify={'flex-end'}>
            {selectedLocation ? <LocationOptions /> : null}
          </Grid>
        </Grid>
      </Grid>

      {!selectedLocation ? (
        <LocationsTable venues={venues} />
      ) : (
        <>
          <div className={classes.divider} />
          <LocationOverview selectedLocation={selectedLocation} locationView={locationView} />
          <LocationCourts selectedLocation={selectedLocation} locationView={locationView} />
          <LocationMedia selectedLocation={selectedLocation} locationView={locationView} />
        </>
      )}
    </>
  );
};
