import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

export const StructureSelector = (props) => {
  const classes = useStyles();
  const { structureId, drawDefinition, selectStructure } = props;

  const structures = (drawDefinition && drawDefinition.structures) || [];
  const structureIds = structures.map((structure) => structure.structureId);
  const displayedStructureId = structureIds.includes(structureId) ? structureId : structureIds[0];

  const structureOptions = structures.map((structure) => {
    const name = structure.structureName || structure.stage;
    return { text: name, value: structure.structureId };
  });

  if (!structures.length || !structureId) return null;

  return (
    <TMXSelect value={displayedStructureId} className={classes.select} onChange={selectStructure}>
      {structureOptions.map((e) => (
        <MenuItem key={e.value} value={e.value}>
          {e.text}
        </MenuItem>
      ))}
    </TMXSelect>
  );
};
