import React from 'react';
import { LTAB_OVERVIEW } from 'stores/tmx/types/tabs';

export function LocationOverview(props) {
  const { locationView, selectedLocation } = props;

  if (locationView !== LTAB_OVERVIEW) return null;
  console.log({ selectedLocation });

  return <>Overview - Notes, Address, Capacity</>;
}
