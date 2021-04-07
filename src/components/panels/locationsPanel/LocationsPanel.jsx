import React from 'react';
import { useSelector } from 'react-redux';
import { useStyles } from 'components/panels/styles';

import { Breadcrumbs, Grid } from '@material-ui/core';
import { LocationSelector } from 'components/selectors/LocationSelector';
import { LocationsTable } from 'components/tables/locationsTable/LocationsTable';
import { LocationOptions } from 'components/forms/editLocation/locationOptions';
import { LocationOverview } from 'components/forms/editLocation/locationOverview';
import { LocationCourts } from 'components/forms/editLocation/locationCourts';
import { LocationMedia } from 'components/forms/editLocation/locationMedia';
import { PanelSelector } from 'components/selectors/PanelSelector';

import { tournamentEngine } from 'tods-competition-factory';
import { TAB_LOCATIONS } from 'stores/tmx/types/tabs';

export const LocationsPanel = ({ tournamentId }) => {
  const classes = useStyles();

  const locationView = useSelector((state) => state.tmx.visible.locationView);
  const selectedVenueId = useSelector((state) => state.tmx.select.venues.venue);
  const { venues } = tournamentEngine.getVenues() || [];
  const selectedLocation = venues.find((venue) => venue.venueId === selectedVenueId);

  return (
    <>
      <Grid container spacing={1} direction="row" justify="flex-start">
        <Grid item>
          <Breadcrumbs aria-label="breadcrumb">
            <PanelSelector tournamentId={tournamentId} contextId={TAB_LOCATIONS} />
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
