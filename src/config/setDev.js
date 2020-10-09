import { db } from 'services/storage/db';
import { context } from 'services/context';
import { exportFx } from 'services/files/exportFx';
import { coms } from 'services/communications/SocketIo/coms';
import { fetchFx } from 'services/communications/Axios/fetchFx';
import { matchUpFormatCode } from 'tods-matchup-format-code';
import { JSONPath } from 'jsonpath-plus';

import { UUID } from 'functions/UUID';
import { isLocalhost } from 'functions/isLocalhost';

import pdfEngine from 'engineFactory/pdfEngine';
import { drawEngine, tournamentEngine, competitionEngine } from 'tods-competition-factory';
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
  if (
    (context.queryString.dev && env.dev === context.queryString.dev) ||
    window.location.host.indexOf('localhost:3') === 0
  ) {
    console.log('dev initialized');
    context.isDev = true;
    window.dev = {};
  }

  context.isLocalhost = isLocalhost;

  addDev({ db });
  addDev({ env });
  addDev({ coms });
  addDev({ UUID });
  addDev({ context });
  addDev({ fetchFx });
  addDev({ JSONPath });
  addDev({ exportFx });
  addDev({ tmxStore });
  addDev({ fetchURL });
  addDev({ pdfEngine });
  addDev({ drawEngine });
  addDev({ matchUpFormatCode });
  addDev({ tournamentEngine });
  addDev({ competitionEngine });
}
