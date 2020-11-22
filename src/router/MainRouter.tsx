import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import HomePage from 'pages/HomePage';
import NotFoundPage from 'pages/NotFoundPage';
import UserTestsPage from 'pages/UserTestsPage';
import TournamentPage from 'pages/TournamentPage';

import {
  HOME,
  NOT_FOUND,
  USER_TEST,
  TOURNAMENT_ID,
  PARTICIPANTS_ROUTE,
  EVENTS_ROUTE,
  EVENT_ROUTE,
  DRAWS_ROUTE,
  DRAW_ROUTE,
  LOCATIONS_ROUTE,
  SETTINGS_ROUTE,
  LOCATION_ROUTE,
  SCHEDULE_ROUTE,
  MATCHUPS_ROUTE
} from 'config/router/constants';
import {
  TAB_EVENTS,
  TAB_LOCATIONS,
  TAB_MATCHUPS,
  TAB_PARTICIPANTS,
  TAB_SCHEDULE,
  TAB_SETTINGS,
  TAB_TOURNAMENT
} from 'stores/tmx/types/tabs';

const MainRouter = () => {
  return (
    <Switch>
      <Route path={USER_TEST} render={() => <UserTestsPage />} />
      <Route exact path={HOME} render={() => <HomePage />} />
      <Route exact path={NOT_FOUND} render={() => <NotFoundPage />} />
      <Route
        exact
        path={PARTICIPANTS_ROUTE}
        render={(props) => <TournamentPage tabIndex={TAB_PARTICIPANTS} {...props} />}
      />
      <Route exact path={EVENTS_ROUTE} render={(props) => <TournamentPage tabIndex={TAB_EVENTS} {...props} />} />
      <Route exact path={EVENT_ROUTE} render={(props) => <TournamentPage tabIndex={TAB_EVENTS} {...props} />} />
      <Route exact path={DRAWS_ROUTE} render={(props) => <TournamentPage tabIndex={TAB_EVENTS} {...props} />} />
      <Route exact path={DRAW_ROUTE} render={(props) => <TournamentPage tabIndex={TAB_EVENTS} {...props} />} />
      <Route exact path={LOCATIONS_ROUTE} render={(props) => <TournamentPage tabIndex={TAB_LOCATIONS} {...props} />} />
      <Route exact path={LOCATION_ROUTE} render={(props) => <TournamentPage tabIndex={TAB_LOCATIONS} {...props} />} />
      <Route exact path={SCHEDULE_ROUTE} render={(props) => <TournamentPage tabIndex={TAB_SCHEDULE} {...props} />} />
      <Route exact path={MATCHUPS_ROUTE} render={(props) => <TournamentPage tabIndex={TAB_MATCHUPS} {...props} />} />
      <Route exact path={SETTINGS_ROUTE} render={(props) => <TournamentPage tabIndex={TAB_SETTINGS} {...props} />} />
      <Route path={TOURNAMENT_ID} render={(props) => <TournamentPage tabIndex={TAB_TOURNAMENT} {...props} />} />
      <Route path="*" render={() => <Redirect to={NOT_FOUND} />} />
    </Switch>
  );
};

export default MainRouter;
