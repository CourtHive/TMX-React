import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { env } from 'config/defaults';
import { useStyles } from './style';

import { ListPicker } from 'components/dialogs/listPicker';
import { TMXPopoverMenu } from 'components/menus/TMXPopoverMenu';
import { knockoutDraw } from './knockoutStructures/knockoutDraw';

import { drawEngine } from 'tods-competition-factory';

export function KnockoutStructure(props) {
  const { drawData } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [pickerData, setPickerData] = useState(undefined);
  const [menuData, setMenuData] = useState(undefined);

  const editState = useSelector((state) => state.tmx.editState);
  const drawResize = useSelector((state) => state.tmx.drawResize);

  const isCompass = false;
  const anchorId = 'knockoutDraw';
  const drawWidth = document.getElementById('root').offsetWidth * 0.9;
  const knockoutOptions = Object.assign({}, env.draws.tree_draw, {
    width: drawWidth,
    flags: { display: true, threshold: 0 },
    names: { seed_number: true },
    compass: { display: isCompass },
    schedule: true,
    details: {
      seeding: true,
      draw_entry: true,
      draw_positions: true,
      teams: env.draws.tree_draw.display.teams,
      player_rankings: !env.players.ratings.display,
      player_ratings: env.players.ratings.display
    },
    seeds: { color: 'red' }
  });

  const closeMenu = () => {
    setMenuData({});
  };

  function scoreMatchUp({ matchUp }) {
    dispatch({ type: 'scoring details', payload: { matchUp } });
  }

  function scoreAction(node) {
    const data = node.data || node;
    scoreMatchUp({ matchUp: data });
  }

  function removeAssignment(_, params) {
    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [{ method: 'removeDrawPositionAssignment', params }]
      }
    });
  }

  function findParticipantName({ bye, participantId, unassignedByes }) {
    const participant = drawData.participants.reduce((participant, candidate) => {
      return candidate.participantId === participantId ? candidate : participant;
    }, undefined);
    const byeOption = bye && `BYE {${unassignedByes}}`;
    return (participant && participant.participantName) || byeOption || 'Unknown';
  }

  function assignPosition(_, payload) {
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
  }

  // singleClickAction indicates that if an item is the only valid item no popover menu required
  const menuActions = [
    {
      action: 'SCORE',
      id: 'scoreMatchUp',
      icon: null,
      click: scoreAction,
      text: 'Match Score',
      singleClickAction: true
    },
    {
      action: 'ASSIGNMENT',
      id: 'assignPosition',
      icon: null,
      click: assignPosition,
      text: 'Assign Position',
      singleClickAction: true
    },
    { action: 'REMOVE', id: 'removePartivipant', icon: null, click: removeAssignment, text: 'Remove' },
    { action: 'REFEREE', icon: null, click: closeMenu, text: 'Set Referee' },
    { action: 'SCHEDULE', icon: null, click: closeMenu, text: 'Set Schedule' },
    { action: 'STATUS', icon: null, click: closeMenu, text: 'Set Match Status' },
    { action: 'PENALTY', icon: null, click: closeMenu, text: 'Assess Penalty' },
    { action: 'NICKNAME', icon: null, click: closeMenu, text: 'Assign Nickname' },
    { action: 'SUSPEND', icon: null, click: closeMenu, text: 'Suspend Match' },
    { action: 'START', icon: null, click: closeMenu, text: 'Set Match Start Time' },
    { action: 'END', icon: null, click: closeMenu, text: 'Set Match End Time' }
  ];

  function actionMenu(node, coords) {
    const { validActions, isDrawPosition, isByePosition } = node.drawPosition
      ? drawEngine.positionActions(node)
      : drawEngine.matchUpActions(node);

    const validActionTypes = validActions?.map((action) => action.type);
    const validActionPayloads =
      validActions?.reduce((payloads, action) => {
        return action.payload ? Object.assign(payloads, { [action.type]: action.payload }) : payloads;
      }, {}) || {};

    const participantName =
      isDrawPosition &&
      node &&
      ((node.sides &&
        node.sides
          .filter((f) => f)
          .reduce((name, side) => {
            return (side.participant && side.participant.participantName) || name;
          }, undefined)) ||
        (node.participant && node.participant.participantName));

    const participantNames =
      node &&
      node.sides &&
      node.sides
        .filter((f) => f)
        .map((side) => {
          if (!side.participant) return undefined;
          const singleParticipantName = side.participant.person && side.participant.person.standardFamilyName;
          const doublesParticipantName = side.participant.individualParticipants && side.participant.participantName;
          return singleParticipantName || doublesParticipantName;
        })
        .filter((f) => f);

    const menuHeader =
      isDrawPosition && participantName
        ? { primary: participantName }
        : !isDrawPosition && participantNames && participantNames.length === 2
        ? { primary: t('Match Options'), secondary: participantNames.join(' vs ') }
        : isByePosition || node.bye
        ? { primary: `Draw Position ${node.drawPosition}: BYE` }
        : undefined;

    if (coords && validActions?.length) {
      const menuPosition = { left: coords.screen_x, top: coords.screen_y };
      const menuItems = menuActions
        .filter((menuAction) => {
          return validActionTypes?.includes(menuAction.action);
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

  function scoreClick(node) {
    const matchUp = node.data || node;
    const { validActions } = node.drawPosition ? drawEngine.positionActions(node) : drawEngine.matchUpActions(matchUp);
    const validActionTypes = validActions?.map((action) => action.type);
    if (validActionTypes?.includes('SCORE')) {
      scoreMatchUp({ matchUp });
    }
  }

  function positionClick(node, coords, teamIndex) {
    console.log({ node, teamIndex });
    const data = node.data || node;
    actionMenu(data, coords);
  }

  const events = {
    position: { click: positionClick, contextmenu: scoreClick },
    person: { click: positionClick, contextmenu: positionClick },
    compass: { mouseover: null, mouseout: null, click: null },
    score: { mouseover: null, mouseout: null, click: scoreClick },
    umpire: { mouseover: null, mouseout: null, click: scoreClick },
    matchdate: { mouseover: null, mouseout: null, click: scoreClick }
  };

  const drawGenerator = knockoutDraw().options(knockoutOptions);
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
}
