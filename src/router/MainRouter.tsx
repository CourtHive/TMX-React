import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { HOME, NOT_FOUND, USER_TEST, TOURNAMENT } from 'config/router/constants';
import HomePage from 'pages/HomePage';
import NotFoundPage from 'pages/NotFoundPage';
import UserTestsPage from 'pages/UserTestsPage';
import TournamentPage from 'pages/TournamentPage';

const MainRouter = () => {
  return (
    <Switch>
      <Route path={USER_TEST} render={() => <UserTestsPage />} />
      <Route exact path={HOME} render={() => <HomePage />} />
      <Route exact path={NOT_FOUND} render={() => <NotFoundPage />} />
      <Route path={TOURNAMENT} render={() => <TournamentPage />} />
      <Route path="*" render={() => <Redirect to={NOT_FOUND} />} />
    </Switch>
  );
};

export default MainRouter;
