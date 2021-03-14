import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

// import { ListPicker } from 'components/dialogs/listPicker';
import { TMXPopoverMenu } from 'components/menus/TMXPopoverMenu';

import { tournamentEngine, positionActionConstants, matchUpActionConstants } from 'tods-competition-factory';
import { EliminationStructure } from 'tods-react-draws';
import { MatchOutcomeContainer } from 'containers/matchUpOutcome/MatchUpOutcomeContainer';

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

export function KnockoutStructure(props) {
  const dispatch = useDispatch();
  const [menuData, setMenuData] = useState(undefined);
  const [targetMatchUp, setTargetMatchUp] = useState(undefined);
  const { eventData, drawId, structureId } = props;

  const closeMenu = () => {
    setMenuData({});
  };

  function getActionsMenuData({ scoringMatchUp, matchUp, sideNumber, onCloseMenu }) {
    const { drawId, structureId, sides } = matchUp || {};
    // const isRoundRobin = roundNumber && !roundPosition;

    const side = sides?.find((side) => side.sideNumber === sideNumber);
    const sourceMatchUp = side?.sourceMatchUp || scoringMatchUp;

    const drawPosition = side?.drawPosition;
    const participantName = side?.participant?.participantName;
    const participantNames = sourceMatchUp?.sides?.map((side) => side.participant?.participantName).filter((f) => f);

    const matchUpActions = tournamentEngine.matchUpActions(sourceMatchUp);
    const positionActions = tournamentEngine.positionActions({ drawId, structureId, drawPosition });
    const { /*isActiveDrawPosition,*/ isByePosition, isDrawPosition } = positionActions || {};
    const validActions = [].concat(...(positionActions?.validActions || []), ...(matchUpActions?.validActions || []));

    // const { isByeMatchUp } = matchUpActions || {};
    // console.log({ validActions, isByeMatchUp, isActiveDrawPosition, isByePosition, isDrawPosition });

    const menuHeader =
      isDrawPosition && participantName
        ? { primary: participantName }
        : !isDrawPosition && !sideNumber && participantNames
        ? { primary: 'Match Options', secondary: participantNames.join(' vs ') }
        : isByePosition
        ? { primary: `Draw Position ${drawPosition}: BYE` }
        : undefined;

    function scoreAction() {
      const matchUp = sourceMatchUp;
      if (matchUp.matchUpType === 'TEAM') {
        dispatch({ type: 'scoring tieMatchUp', payload: { matchUp } });
      } else {
        setTargetMatchUp(matchUp);
        // dispatch({ type: 'scoring details', payload: { matchUp } });
      }
    }

    function assignPosition(validAction) {
      console.log({ validAction });
      /*
    function doAssignment({ selection } = {}) {
      if (selection && selection.value) {
        tmxStore.dispatch({
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
    if (payload.validToAssign) {
      const options = payload.validToAssign.map((valid) => {
        let label = findParticipantName(valid);
        if (valid.seedValue) label += ` [${valid.seedValue}]`;
        return { value: valid, label };
      });
      const callback = (value) => {
        if (value) doAssignment(value);
        setPickerData();
      };
      if (options.length) {
        setPickerData({ options, callback });
      }
    }
    */
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
        action = validActions.find((action) => action.type === menuItems[0].type);
      } else {
        actionMenuData = { menuItems, menuHeader };
      }
    }
    return { actionMenuData, action };
  }
  const onScoreClick = ({ matchUp, sideIndex, e }) => {
    const menuPosition = { left: e.clientX, top: e.clientY };
    const { action, actionMenuData } = getActionsMenuData({ scoringMatchUp: matchUp });
    if (action) {
      console.log('Scoring matchUp', { sideIndex, action });
    } else {
      setMenuData({ menuPosition, ...actionMenuData, open: true });
    }
  };
  const onParticipantClick = ({ matchUp, sideNumber, e }) => {
    const menuPosition = { left: e.clientX, top: e.clientY };
    const { action, actionMenuData } = getActionsMenuData({ matchUp, sideNumber });
    if (action) {
      console.log('take action', { action });
    } else {
      setMenuData({ menuPosition, ...actionMenuData, open: true });
    }
  };
  const args = { eventData, drawId, structureId, onScoreClick, onParticipantClick };

  const closeMatchUpOutcome = () => setTargetMatchUp(undefined);

  return (
    <>
      <EliminationStructure {...args} />
      <TMXPopoverMenu {...menuData} closeMenu={closeMenu} />
      <MatchOutcomeContainer matchUp={targetMatchUp} closeDialog={closeMatchUpOutcome} />
    </>
  );
}

// {pickerData ? <ListPicker {...pickerData} /> : null}
// <div id={anchorId} className={classes.tmxDraws} />
