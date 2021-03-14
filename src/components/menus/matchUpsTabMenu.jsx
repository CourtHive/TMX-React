import React from 'react';
import { useTranslation } from 'react-i18next';
import { TMXPopoverMenu } from 'components/menus/TMXPopoverMenu';

import { tournamentEngine } from 'tods-competition-factory';

export function MatchUpTabMenu({ matchUpData, closeMenu, menuActions }) {
  const { t } = useTranslation();

  const { matchUp, coords } = matchUpData || {};

  if (!matchUp || !matchUp.drawId) {
    closeMenu();
    return null;
  }

  const { validActions, isDrawPosition } = tournamentEngine.matchUpActions(matchUp);
  const validActionTypes = validActions.map((action) => action.type);

  let menuData;
  const menuPosition = { left: coords.screen_x, top: coords.screen_y };
  const menuItems = menuActions
    .filter((menuAction) => {
      return menuAction.divider || validActionTypes.includes(menuAction.action);
    })
    .map((menuAction) => {
      if (menuAction.click) {
        const onClick = () => {
          menuAction.click({ matchUp });
        };
        Object.assign(menuAction, { onClick });
      }
      return menuAction;
    });

  if (menuItems.length === 1) {
    menuItems[0].onClick();
  } else {
    const participantName =
      isDrawPosition &&
      matchUp.sides.reduce((name, side) => {
        return (side.participant && side.participant.participantName) || name;
      }, undefined);
    const participantNames = matchUp.sides
      .filter((f) => f)
      .map((side) => {
        return side.participant && side.participant.person && side.participant.person.standardFamilyName;
      })
      .filter((f) => f);

    const vs = ` ${t('vs')} `;
    const menuHeader =
      isDrawPosition && participantName
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
      <TMXPopoverMenu open={true} {...menuData} closeMenu={closeMenu} />
    </>
  );
}
