import React, { useState } from 'react';

import { ListPicker } from 'components/dialogs/listPicker';
import { TMXPopoverMenu } from 'components/menus/TMXPopoverMenu';

import { tournamentEngine, positionActionConstants, matchUpActionConstants } from 'tods-competition-factory';

const {
  // ALTERNATE_PARTICIPANT,
  // WITHDRAW_PARTICIPANT,
  ASSIGN_PARTICIPANT,
  // LUCKY_PARTICIPANT,
  REMOVE_ASSIGNMENT,
  SWAP_PARTICIPANTS
  // ADD_NICKNAME,
  // ADD_PENALTY,
  // ASSIGN_BYE,
  // SEED_VALUE
} = positionActionConstants;

const { END, NICKNAME, PENALTY, REFEREE, SCHEDULE, SCORE, START, STATUS } = matchUpActionConstants;

export function getActionsMenuData({ scoringMatchUp, matchUp, sideNumber }) {
  const { drawId, structureId, sides } = matchUp || {};
  // const isRoundRobin = roundNumber && !roundPosition;

  const side = sides?.find((side) => side.sideNumber === sideNumber);
  const sourceMatchUp = side?.sourceMatchUp || scoringMatchUp;

  const drawPosition = side?.drawPosition;
  const participantName = side?.participant?.participantName;
  const participantNames = sourceMatchUp?.sides?.map((side) => side.participant?.participantName).filter((f) => f);

  const matchUpActions = tournamentEngine.matchUpActions(sourceMatchUp);
  const positionActions = tournamentEngine.positionActions({ drawId, structureId, drawPosition });
  const { isActiveDrawPosition, isByePosition, isDrawPosition } = positionActions || {};
  const { isByeMatchUp } = matchUpActions || {};
  const validActions = [].concat(...(positionActions?.validActions || []), ...(matchUpActions?.validActions || []));
  const actions = Object.assign(
    {},
    { validActions, isByeMatchUp, isActiveDrawPosition, isByePosition, isDrawPosition }
  );

  const menuHeader =
    isDrawPosition && participantName
      ? { primary: participantName }
      : !isDrawPosition && !sideNumber && participantNames
      ? { primary: 'Match Options', secondary: participantNames.join(' vs ') }
      : isByePosition
      ? { primary: `Draw Position ${drawPosition}: BYE` }
      : undefined;

  return { actions, menuHeader };
}

export const ActionsMenu = ({ actions, e }) => {
  const [menuData, setMenuData] = useState(undefined);
  const [pickerData, setPickerData] = useState(undefined);

  const menuPosition = { left: e.clientX, top: e.clientY };

  setPickerData();
  const closeMenu = () => setMenuData({});

  const takeAction = (type) => {
    const action = actions.find((action) => action.type === type);
    console.log('take', { action });
  };

  const menuActions = [
    {
      type: SCORE,
      id: 'scoreMatchUp',
      icon: null,
      text: 'Match Score',
      singleClickAction: true
    },
    {
      type: ASSIGN_PARTICIPANT,
      id: 'assignPosition',
      icon: null,
      text: 'Assign Position',
      singleClickAction: true
    },
    { type: REMOVE_ASSIGNMENT, id: 'removeParticipant', icon: null, text: 'Remove' },
    { type: REFEREE, icon: null, text: 'Set Referee' },
    { type: SCHEDULE, icon: null, text: 'Set Schedule' },
    { type: STATUS, icon: null, text: 'Set Match Status' },
    { type: PENALTY, icon: null, text: 'Assess Penalty' },
    { type: NICKNAME, icon: null, text: 'Assign Nickname' },
    // { type: 'SUSPEND', icon: null, text: 'Suspend Match' },
    { type: SWAP_PARTICIPANTS, icon: null, text: 'Swap Positions' },
    { type: START, icon: null, text: 'Set Match Start Time' },
    { type: END, icon: null, text: 'Set Match End Time' }
  ];

  const validActionTypes = actions?.validActions?.map((action) => action.type);
  if (actions?.length) {
    const menuItems = menuActions
      .filter((menuAction) => {
        return validActionTypes?.includes(menuAction.type);
      })
      .map((menuAction) => {
        if (menuAction.click) {
          const onClick = () => {
            closeMenu();
            takeAction(menuAction.type);
          };
          Object.assign(menuAction, { onClick });
        }
        return menuAction;
      });
    if (menuItems.length === 1 && menuItems[0].singleClickAction) {
      closeMenu();
      takeAction(menuItems[0].type);
    } else {
      setMenuData({ menuPosition, menuItems, /*menuHeader,*/ open: true });
    }
  }

  return (
    <>
      {pickerData ? <ListPicker {...pickerData} /> : null}
      <TMXPopoverMenu {...menuData} closeMenu={closeMenu} />
    </>
  );
};
