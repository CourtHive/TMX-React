import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

export const LocationSelector = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { venues, selectedVenueId } = props;

  const selectVenue = (event) => {
    const venueId = event.target.value;
    const payload = venueId !== '-' && { venueId };
    dispatch({ type: 'select venue', payload });
  }
  
  const options = venues.map((venue) => {
    // attempt to use abbreviation if venue name too long
    const abbreviation = venue.venueAbbreviation || venue.venueName;
    const text = venue.venueName.length > 12 ? abbreviation : venue.venueName;
    return { text, value: venue.venueId }
  });

  return (
    <>
      {!options.length ? null : (
        <TMXSelect className={classes.select} value={selectedVenueId} onChange={selectVenue}>
          <MenuItem value="-">
            <em>{t('All Locations')}</em>
          </MenuItem>
          {options.map((t) => (
            <MenuItem key={t.value} value={t.value}>
              {t.text}
            </MenuItem>
          ))}
        </TMXSelect>
      )}
    </>
  );
};
