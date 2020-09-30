import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useStyles } from './style';
import { env } from 'config/defaults';

// import { drawEngine } from 'competitionFactory';
import { drawEngine } from 'tods-competition-factory';
import { ListPicker } from 'components/dialogs/listPicker';
import { TMXPopoverMenu } from 'components/menus/TMXPopoverMenu';
import { roundRobinDraw } from './roundRobinStructures/roundRobinDraw';

export const RoundRobinStructure = (props) => {
  const { drawData } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [menuData, setMenuData] = useState(undefined);
  const [pickerData, setPickerData] = useState(undefined);
  const editState = useSelector((state) => state.tmx.editState);
  const drawResize = useSelector((state) => state.tmx.drawResize);

  const anchorId = 'roundRobinDraw';

  const drawIsQualifying = false;
  const roundRobinOptions = Object.assign({}, env.draws.rr_draw, {
    min_width: 300,
    details: {
      games_won_lost: env.draws.rr_draw.details.games_won_lost,
      player_ratings: env.players.ratings.display
    },
    labels: { group: t('group') },
    seeds: { color: 'red' },
    qualifying: drawIsQualifying
  });

  const closeMenu = () => {
    setMenuData({});
  };

  const menuActions = [
    { action: 'SCORE', id: 'scoreMatchUp', icon: null, click: scoreAction, text: 'Match Score' },
    {
      action: 'ASSIGNMENT',
      id: 'assignPosition',
      icon: null,
      click: assignPosition,
      text: 'Assign Position',
      singleClickAction: true
    },
    { action: 'REMOVE', id: 'removeParticipant', icon: null, click: removeAssignment, text: 'Remove' },
    { action: 'REFEREE', icon: null, click: closeMenu, text: 'Set Referee' },
    { action: 'SCHEDULE', icon: null, click: closeMenu, text: 'Set Schedule' },
    { action: 'PENALTY', icon: null, click: closeMenu, text: 'Assess Penalty' },
    { action: 'STATUS', icon: null, click: closeMenu, text: 'Set Match Status' },
    { action: 'NICKNAME', icon: null, click: closeMenu, text: 'Assign Nickname' },
    { action: 'SUSPEND', icon: null, click: closeMenu, text: 'Suspend Match' },
    { action: 'START', icon: null, click: closeMenu, text: 'Set Match Start Time' },
    { action: 'END', icon: null, click: closeMenu, text: 'Set Match End Time' }
  ];

  function actionMenu(node, coords, teamIndex) {
    const matchUp = node.matchUp;
    const {
      validActions,
      isDrawPosition
      // isByePosition
    } = node.drawPosition ? drawEngine.positionActions(node) : drawEngine.matchUpActions(matchUp);

    const validActionTypes = validActions.map((action) => action.type);
    const validActionPayloads = validActions.reduce((payloads, action) => {
      return action.payload ? Object.assign(payloads, { [action.type]: action.payload }) : payloads;
    }, {});

    const participantName = isDrawPosition && node.participant && node.participant.name;

    const participantNames =
      matchUp &&
      matchUp.Sides &&
      matchUp.Sides.filter((f) => f)
        .map((side) => {
          return side.participant && side.participant.person && side.participant.person.standardFamilyName;
        })
        .filter((f) => f);

    const menuHeader =
      isDrawPosition && participantName
        ? { primary: participantName }
        : !isDrawPosition
        ? { primary: t('Match Options'), secondary: participantNames && participantNames.join(' vs ') }
        : undefined;

    if (coords && validActions.length) {
      const menuPosition = { left: coords.screen_x, top: coords.screen_y };
      const menuItems = menuActions
        .filter((menuAction) => {
          return validActionTypes.includes(menuAction.action);
        })
        .map((menuAction) => {
          if (menuAction.click) {
            const onClick = () => {
              menuAction.click(node, validActionPayloads[menuAction.action]);
            };
            Object.assign(menuAction, { onClick });
          }
          return menuAction;
        });
      if (menuItems.length === 1 && menuItems[0].singleClickAction) {
        menuItems[0].onClick();
      } else {
        setMenuData({ menuPosition, menuItems, menuHeader, open: true });
      }
    }
  }

  function removeAssignment(_, params) {
    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [ { method: 'removeDrawPositionAssignment', params } ]
      }
    });
  }

  function scoreAction(node) {
    const matchUp = node.matchUp;
    if (matchUp) {
      const { validActions } = drawEngine.matchUpActions(matchUp);
      const validActionTypes = validActions.map((action) => action.type);
      if (validActionTypes.includes('SCORE')) {
        scoreMatchUp({ matchUp });
      }
    }
  }

  function assignPosition(_, payload) {
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
      setPickerData({ options, callback });
    }
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
  }

  function findParticipantName({ bye, participantId, unassignedByes }) {
    const participant = drawData.participants.reduce((participant, candidate) => {
      return candidate.participantId === participantId ? candidate : participant;
    }, undefined);
    const byeOption = bye && `BYE {${unassignedByes}}`;
    return (participant && participant.name) || byeOption || 'Unknown';
  }

  function scoreMatchUp({ matchUp }) {
    dispatch({ type: 'scoring details', payload: { matchUp } });
  }

  function clickAction(event) {
    console.log('clickAction', { event });
  }

  const events = {
    score: { click: actionMenu, mouseover: null, mouseout: null, contextmenu: scoreAction },
    player: { click: actionMenu, mouseover: null, mouseout: null, contextmenu: null },
    info: { click: () => clickAction('info'), mouseover: null, mouseout: null, contextmenu: null },
    qorder: { click: () => clickAction('qorder'), mouseover: null, mouseout: null, contextmenu: null },
    result: { click: () => clickAction('result'), mouseover: null, mouseout: null, contextmenu: null },
    drawPosition: { click: () => clickAction('drawPosition'), mouseover: null, mouseout: null, contextmenu: null },
    sizing: { width: null } // optional functions for sizeToFit
  };

  const drawGenerator = roundRobinDraw().options(roundRobinOptions);
  if (editState) {
    drawGenerator.events(events);
  }

  useEffect(() => {
    const selector = document.getElementById(anchorId);
    if (selector) {
      drawGenerator.selector(selector).data(drawData)();
    }
  }, [drawGenerator, drawData, drawResize]);

  if (!drawData || !Object.keys(drawData).length) return null;

  // TODO: add properly designed button
  return (
    <>
      {pickerData ? <ListPicker {...pickerData} /> : null}
      <TMXPopoverMenu {...menuData} closeMenu={closeMenu} />
      <div id={anchorId} className={classes.tmxDraws} />
    </>
  );
};
