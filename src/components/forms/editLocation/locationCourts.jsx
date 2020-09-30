import React from 'react';
import { LTAB_COURTS } from 'stores/tmx/types/tabs';

export function LocationCourts(props) {
  const { locationView, selectedLocation } = props;

  if (locationView !== LTAB_COURTS) return null;
  console.log({selectedLocation});

  return (
    <>
      Courts - set court names, availability, gps
    </>
  )
}
