import React from 'react';
import ListSelect from 'components/selectors/tmxList/ListSelect';

export const StructureSelector = (props) => {
  const { structureId, drawDefinition, selectStructure } = props;

  const structures = (drawDefinition && drawDefinition.structures) || [];
  const structureIds = structures.map((structure) => structure.structureId);
  const displayedStructureId = structureIds.includes(structureId) ? structureId : structureIds[0];

  const structureItems = structures.map((structure) => ({
    itemName: structure.structureName || structure.stage,
    itemId: structure.structureId
  }));

  if (!structures.length || !structureId) return null;

  return <ListSelect items={structureItems} selectedId={displayedStructureId} onChange={selectStructure} />;
};
