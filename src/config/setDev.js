import { db } from 'services/storage/db';
import { context } from 'services/context';
import { exportFx } from 'services/files/exportFx';
import { fetchFx } from 'services/communications/Axios/fetchFx';
import { matchUpFormatCode } from 'tods-matchup-format-code';

import { isLocalhost } from 'functions/isLocalhost';

import { drawEngine, tournamentEngine, competitionEngine, utilities } from 'tods-competition-factory';
import { fetchURL } from 'services/communications/Axios/fetch/fetchURL';

import { tmxStore } from 'stores/tmxStore';

let addDevErrors = 0;
export function addDev(variable) {
  try {
    Object.keys(variable).forEach((key) => (window.dev[key] = variable[key]));
  } catch (err) {
    if (!addDevErrors) {
      console.log('production environment');
      addDevErrors += 1;
    }
  }
}

export function setDev({ env }) {
  // if ?dev= equals env.dev then enable dev object access in console
  if ((context.queryString.dev && env.dev === context.queryString.dev) || isLocalhost) {
    console.log('%c dev initialized', 'color: yellow');
    context.isDev = true;
    window.dev = {};
  }

  context.isLocalhost = isLocalhost;

  addDev({ db });
  addDev({ env });
  addDev({ context });
  addDev({ fetchFx });
  addDev({ exportFx });
  addDev({ tmxStore });
  addDev({ fetchURL });
  addDev({ utilities });
  addDev({ drawEngine });
  addDev({ matchUpFormatCode });
  addDev({ tournamentEngine });
  addDev({ competitionEngine });
}
