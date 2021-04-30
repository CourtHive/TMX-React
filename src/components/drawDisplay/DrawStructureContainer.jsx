import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { ListPicker } from 'components/dialogs/listPicker';
import { TMXPopoverMenu } from 'components/menus/TMXPopoverMenu';

import { tournamentEngine, positionActionConstants, matchUpActionConstants } from 'tods-competition-factory';
import { MatchOutcomeContainer } from 'containers/matchUpOutcome/MatchUpOutcomeContainer';
import { DrawStructure } from 'tods-react-draws';

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

export function DrawStructureContainer(props) {
  const dispatch = useDispatch();
  const [menuData, setMenuData] = useState(undefined);
  const [pickerData, setPickerData] = useState(undefined);
  const [targetMatchUp, setTargetMatchUp] = useState(undefined);
  const { eventData, drawId, structureId } = props;

  const closeMenu = () => {
    setMenuData({});
  };

  function getActionsMenuData({ drawPosition, scoringMatchUp, matchUp, sideIndex, onCloseMenu }) {
    const { eventId } = eventData?.eventInfo || {};

    const side = matchUp?.sides && matchUp.sides[sideIndex];
    const sourceMatchUp = side?.sourceMatchUp || scoringMatchUp || ([0, 1].includes(sideIndex) && matchUp);
    const feedBottom = sourceMatchUp?.feedBottom;

    const participantName = side?.participant?.participantName;
    const participantNames = sourceMatchUp?.sides?.map((side) => side.participant?.participantName).filter((f) => f);

    const matchUpActions = tournamentEngine.matchUpActions(sourceMatchUp);
    const positionActions = tournamentEngine.positionActions({ eventId, drawId, structureId, drawPosition });
    const { /*isActiveDrawPosition,*/ isByePosition, isDrawPosition } = positionActions || {};
    const validActions = [].concat(...(positionActions?.validActions || []), ...(matchUpActions?.validActions || []));
    if (feedBottom) {
      participantNames.reverse();
    }

    const menuHeader =
      isDrawPosition && participantName
        ? { primary: participantName }
        : !isDrawPosition && participantNames
        ? { primary: 'Match Options', secondary: participantNames.join(' vs ') }
        : isByePosition
        ? { primary: `Draw Position ${drawPosition || side?.drawPosition}: BYE` }
        : undefined;

    function scoreAction() {
      const matchUp = sourceMatchUp;
      if (matchUp.matchUpType === 'TEAM') {
        dispatch({ type: 'scoring tieMatchUp', payload: { matchUp } });
      } else {
        setTargetMatchUp(matchUp);
      }
    }

    function assignPosition({ validAction }) {
      function doAssignment({ selection } = {}) {
        if (selection && selection.value) {
          dispatch({
            type: 'tournamentEngine',
            payload: {
              methods: [
                {
                  method: 'assignDrawPosition',
                  params: selection.value
                }
              ]
            }
          });
        }
      }
      if (validAction.participantsAvailable) {
        const options = validAction.participantsAvailable.map((participant) => {
          let label = participant.participantName;
          // if (valid.seedValue) label += ` [${valid.seedValue}]`;
          return { value: { drawId, drawPosition, structureId, participantId: participant.participantId }, label };
        });
        const callback = (value) => {
          if (value) doAssignment(value);
          setPickerData();
        };
        if (options.length) {
          setPickerData({ options, callback });
        }
      }
    }
    const menuActions = [
      {
        type: SCORE,
        id: 'scoreMatchUp',
        icon: null,
        click: scoreAction,
        text: 'Match Score',
        singleClickAction: true
      },
      {
        type: ASSIGN_PARTICIPANT,
        id: 'assignPosition',
        icon: null,
        click: assignPosition,
        text: 'Assign Position',
        singleClickAction: true
      },
      { type: REMOVE_ASSIGNMENT, id: 'removeParticipant', icon: null, text: 'Remove' },
      { type: REFEREE, icon: null, text: 'Set Referee' },
      { type: SCHEDULE, icon: null, text: 'Set Schedule' },
      { type: STATUS, icon: null, text: 'Set Match Status' },
      { type: PENALTY, icon: null, text: 'Assess Penalty' },
      { type: NICKNAME, icon: null, text: 'Assign Nickname' },
      { type: 'SUSPEND', icon: null, text: 'Suspend Match' },
      { type: SWAP_PARTICIPANTS, icon: null, text: 'Swap Positions' },
      { type: START, icon: null, text: 'Set Match Start Time' },
      { type: END, icon: null, text: 'Set Match End Time' }
    ];

    let actionMenuData, action;
    const closeMenu = () => typeof onCloseMenu === 'function' && onCloseMenu();
    const takeAction = (type) => {
      const action = menuActions.find((action) => action.type === type);
      if (action?.click && typeof action.click === 'function') {
        const validAction = validActions.find((action) => action.type === type);
        action.click({ validAction });
      }
    };

    const validActionTypes = validActions?.map((action) => action.type);

    if (validActions?.length) {
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
        action = {
          validAction: validActions.find((action) => action.type === menuItems[0].type),
          menuItem: menuItems[0]
        };
      } else {
        actionMenuData = { menuItems, menuHeader };
      }
    }
    return { actionMenuData, action };
  }
  const eventHandlers = {
    onScoreClick: ({ matchUp, sideIndex, e }) => {
      const menuPosition = { left: e.clientX, top: e.clientY };
      const { action, actionMenuData } = getActionsMenuData({ scoringMatchUp: matchUp });
      if (action) {
        console.log('Scoring matchUp', { sideIndex, action });
      } else {
        setMenuData({ menuPosition, ...actionMenuData, open: true });
      }
    },
    onParticipantClick: ({ participant, matchUp, sideIndex, drawPosition, e }) => {
      const menuPosition = { left: e.clientX, top: e.clientY };
      const { action, actionMenuData } = getActionsMenuData({
        participant,
        matchUp,
        scoringMatchUp: matchUp,
        sideIndex,
        drawPosition
      });
      if (action?.menuItem) {
        action.menuItem.onClick(action);
      } else {
        setMenuData({ menuPosition, ...actionMenuData, open: true });
      }
    }
  };
  const args = { eventData, drawId, structureId, eventHandlers };

  const closeMatchUpOutcome = () => setTargetMatchUp(undefined);

  return (
    <>
      <DrawStructure {...args} />
      <TMXPopoverMenu {...menuData} closeMenu={closeMenu} />
      <MatchOutcomeContainer matchUp={targetMatchUp} closeDialog={closeMatchUpOutcome} />
      {pickerData ? <ListPicker {...pickerData} /> : null}
    </>
  );
}
