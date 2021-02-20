import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { tabRoute } from 'components/tournament/tabRoute';
import ListSelect from 'components/selectors/tmxList/ListSelect';
import { TAB_EVENTS, TAB_MATCHUPS, TAB_PARTICIPANTS, TAB_SCHEDULE, TAB_LOCATIONS } from 'stores/tmx/types/tabs';

export const PanelSelector = ({ tournamentId, contextId }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const handleContextChange = ({ itemId }) => {
    const nextRoute = tabRoute({ tournamentId, tabIndex: itemId });
    history.push(nextRoute);
  };

  const contextItems = [
    { itemName: t('evt'), itemId: TAB_EVENTS },
    { itemName: t('participants'), itemId: TAB_PARTICIPANTS },
    { itemName: t('mts'), itemId: TAB_MATCHUPS },
    { itemName: t('sch'), itemId: TAB_SCHEDULE },
    { itemName: t('Locations'), itemId: TAB_LOCATIONS }
  ];
  return <ListSelect items={contextItems} selectedId={contextId} onChange={handleContextChange} />;
};
