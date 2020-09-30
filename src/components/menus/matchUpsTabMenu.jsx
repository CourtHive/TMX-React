import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { TMXPopoverMenu } from 'components/menus/TMXPopoverMenu';
// import { tournamentEngine } from 'competitionFactory';
import { tournamentEngine } from 'tods-competition-factory';

export function MatchUpTabMenu({matchUpData, closeMenu}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  
  const { matchUp, coords } = matchUpData || {};

  if (!matchUp || !matchUp.drawId) {
    closeMenu();
    return null;
  }
 
  const { validActions, isDrawPosition } = tournamentEngine.matchUpActions(matchUp);
  const validActionTypes = validActions.map(action => action.type);

  function scoreAction({matchUp}) {
    closeMenu();
    dispatch({ type: 'scoring details', payload: { matchUp } });
  }

  const menuActions = [
      { action: 'SCORE', id: 'scoreMatchUp', icon: null, click: scoreAction, text: 'Match Score' },
      { action: 'REFEREE', icon: null, click: closeMenu, text: 'Set Referee' },
      { action: 'SCHEDULE', icon: null, click: closeMenu, text: 'Set Schedule' },
      { action: 'PENALTY', icon: null, click: closeMenu, text: 'Assess Penalty' },
      { action: 'NICKNAME', icon: null, click: closeMenu, text: 'Assign Nickname' },
      { action: 'SUSPEND', icon: null, click: closeMenu, text: 'Suspend Match' },
      { action: 'START', icon: null, click: closeMenu, text: 'Set Match Start Time' },
      { action: 'END', icon: null, click: closeMenu, text: 'Set Match End Time' }
  ];

  let menuData;
  const menuPosition = { left: coords.screen_x, top: coords.screen_y };
  const menuItems = menuActions
    .filter(menuAction => {
        return menuAction.divider || validActionTypes.includes(menuAction.action);
    }).map(menuAction => {
      if (menuAction.click) {
        const onClick = () => { menuAction.click({matchUp}); }
        Object.assign(menuAction, { onClick });
      }
      return menuAction;
    });

  if (menuItems.length === 1) {
    menuItems[0].onClick();
  } else {
    const participantName = isDrawPosition && matchUp.Sides.reduce((name, side) => {
      return (side.participant && side.participant.name) || name;
    }, undefined);
    const participantNames = matchUp.Sides.filter(f=>f).map(side => {
      return side.participant && side.participant.person && side.participant.person.standardFamilyName;
    }).filter(f=>f);

    const vs = ` ${t('vs')} `;
    const menuHeader = isDrawPosition && participantName
      ? { primary: participantName }
      : !isDrawPosition && participantNames.length === 2
      ? { primary: t('Match Options'), secondary: participantNames.join(vs) }
      : undefined;

    menuData = { menuPosition, menuItems, menuHeader };
  }

  if (!menuData) {
    closeMenu();
    return null;
  }

  return (
    <>
      <TMXPopoverMenu
          open={true}
          { ...menuData }
          closeMenu={closeMenu}
      />
    </>
  )

}