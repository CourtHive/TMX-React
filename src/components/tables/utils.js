export const filterTableRows = (tableData, visibleColumns, targetValue) => {
  const keys = visibleColumns.map((column) => column.key);
  return tableData.filter((data) => {
    const cellValuesArray = Object.entries(data)
      .filter(([key, value]) => keys.includes(key) && !!value)
      .map(([, value]) => value.toString())
      .filter((value) => value.toLowerCase().includes(targetValue.toLowerCase()));
    return cellValuesArray.length > 0;
  });
};

export function opponentsInclude({ matchUp, participantIds }) {
  const opponentIds = matchUp?.sides
    ?.map((side) => {
      const participantId = side?.participantId;
      const individualParticipants = side?.individidualParticipants || [];
      return individualParticipants.concat(participantId);
    })
    .flat();
  return opponentIds.find((opponentId) => participantIds.includes(opponentId));
}

export const matchUpFilter = (matchUp, teamIds, selectedDraw) => {
  const NONE = '-';
  if (matchUp.matchUpStatus === 'BYE') return false;
  if (selectedDraw && selectedDraw !== NONE && matchUp.drawId && matchUp.drawId !== selectedDraw) return false;
  if (teamIds?.length && !opponentsInclude({ matchUp, participantIds: teamIds })) return false;
  return true;
};

export const getColumnMenuItems = (tableColumns, onClick) => {
  return tableColumns.map((column) => ({
    id: column.key,
    key: column.key,
    text: column.getTitle()?.node,
    checked: !(column.hidden && column.hidden()),
    onClick: onClick
  }));
};

export const getMouse = (event) => {
  return { x: event.clientX, y: event.clientY, pageX: event.pageX, pageY: event.pageY };
};
