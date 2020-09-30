import React from 'react';
import { LTAB_MEDIA } from 'stores/tmx/types/tabs';

export function LocationMedia(props) {
  const { locationView, selectedLocation } = props;

  if (locationView !== LTAB_MEDIA) return null;
  console.log({selectedLocation});

  return (
    <>
      Media - Logo and Map
    </>
  )
}
