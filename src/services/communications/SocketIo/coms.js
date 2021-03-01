import { env } from 'config/defaults';
import { token } from 'config/bearerToken';
import { context } from 'services/context';
import { contentEquals } from 'services/screenSlaver';
import { getLoginState } from 'services/authentication/loginState';
import { isLocalhost } from 'functions/isLocalhost';
import { isDev } from 'functions/isDev';

import i18n from 'i18next';
import io from 'socket.io-client';

import { UUID } from 'functions/UUID';
import { getNavigator } from 'functions/browser';

import { tmxStore } from 'stores/tmxStore';
import { getTournamentRecord } from 'stores/accessor';
import { receiveIdiomList } from 'services/idiomManager';
import { processDirective, receiveTournaments } from 'services/communications/SocketIo/receiveDirective';
import { receiveRegisteredPlayers, receiveTournamentCalendar } from 'services/communications/SocketIo/receiveLists';

export const coms = (function () {
  const fx = {};
  let keyQueue = [];
  const socketQueue = [];
  const ackRequests = {};
  let connected = false;

  function initListeners() {
    context.ee.addListener('emitTmx', fx.emitTmx);
    context.ee.addListener('sendKey', fx.sendKey);
    context.ee.addListener('queueKey', fx.queueKey);
    context.ee.addListener('logError', fx.logError);
  }

  fx.init = () => {
    initListeners();
  };

  const oi = {
    socket: undefined
  };

  fx.onLine = () => {
    // eslint-disable-next-line
    return getNavigator().onLine || isLocalhost;
  };

  function socketEmit(msg, data) {
    if (!oi.socket.connected) console.log('socket not connected');
    oi.socket.emit(msg, data);
  }

  function emitTmx(data, ackCallback) {
    if (!data.payload) data.payload = {};
    const loginValues = getLoginState();
    const personId = loginValues && loginValues.personId;

    Object.assign(data.payload, {
      personId,
      uuuid: env.uuuid,
      version: env.version,
      provider: env.org?.abbr,
      providerId: env.org?.ouid,
      timestamp: new Date().getTime()
    });

    if (ackCallback && typeof ackCallback === 'function') {
      const ackId = UUID.new();
      Object.assign(data.payload, { ackId });
      fx.requestAcknowledgement({ ackId, callback: ackCallback });
    }

    if (connected) {
      socketEmit('tmx', data);
    } else {
      // this queue is not persisted if browser refreshes
      // to insure the server says synced with locl copy of tournament
      // this queue must persist... implement in localStorage?
      socketQueue.push({ data, ackCallback });
    }
  }
  fx.emitTmx = emitTmx;

  function tmxError(err) {
    if (!err) return;
    const message = err.phrase ? i18n.t(`phrases.${err.phrase}`) : err.error;
    if (message) {
      tmxStore.dispatch({
        type: 'toaster state',
        payload: { severity: 'error', message }
      });
    }
  }

  // keyQueue is used for keys that can't be sent/submitted until the env is set up with user uuid
  fx.queueKey = (key) => {
    keyQueue.push(key);
  };
  fx.sendKey = (key) => {
    fx.emitTmx({ action: 'sendKey', payload: { key } });
  };
  fx.sendQueuedKeys = () => {
    keyQueue.forEach(fx.sendKey);
    keyQueue = [];
  };

  function connectionEvent() {
    fx.connectAction();
    const tournament = getTournamentRecord();
    const tournamentId = tournament?.unifiedTournamentId?.tournamentId || tournament?.tournamentId;
    if (contentEquals('tournament') && tournament) {
      fx.joinTournament({ tournamentId });
    } else {
      if (tournamentId) fx.leaveTournament(tournamentId);
    }
  }

  fx.connected = () => connected;
  function comsConnect() {
    connected = true;
    connectionEvent();
    while (socketQueue.length) {
      const message = socketQueue.pop();
      emitTmx(message.data, message.ackCallback);
    }
  }

  fx.logError = (err) => {
    if (!err) return;
    const stack = err.stack && err.stack.toString();
    const error_message = typeof err === 'object' ? JSON.stringify(err) : err;
    const eventError = { stack, error_message };
    fx.emitTmx({ action: 'clientError', payload: { eventError } });
  };

  function comsDisconnect() {
    if (isDev()) console.log('%c Server disconnect', 'color: orange');
    connected = false;
  }
  function comsError(err) {
    if (isDev()) console.log('connect error', { err });
  }
  fx.connectAction = () => {
    fx.sendQueuedKeys();
  };

  function receiveAcknowledgement(msg) {
    if (isLocalhost) {
      console.log(`%c received acknowledgement: ${msg.type}`, 'color: lightgreen');
    }

    if (msg.ackId && ackRequests[msg.ackId]) {
      ackRequests[msg.ackId](msg);
      delete ackRequests[msg.ackId];
    }
  }

  fx.connectSocket = () => {
    const chcsRootURL = isLocalhost
      ? 'http://localhost:8065'
      : process.env.REACT_APP_CHCS_ROOT_URL || window.location.host;

    const chcsServerPath = process.env.REACT_APP_CHCS_SERVER_PATH || '';
    const socketIoPath = env.socketIo.tmx || '';

    if (!oi.socket) {
      const URL = `${chcsRootURL}${socketIoPath}?token=${token}`;
      const connectionOptions = {
        'force new connection': true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 'Infinity',
        timeout: 20000,
        path: `${chcsServerPath}/socket.io`
      };

      oi.socket = io.connect(URL, connectionOptions);

      // 2.0 verified
      oi.socket.on('ack', (ack) => receiveAcknowledgement(ack));
      oi.socket.on('connect', (data) => {
        comsConnect(data);
      });
      oi.socket.on('console', (data) => console.log('console', { data }));
      oi.socket.on('tmx message', (data) => context.ee.emit('tmxMessage', data));
      oi.socket.on('tmx directive', (data) => processDirective(data));
      oi.socket.on('idioms available', (list) => {
        receiveIdiomList(list);
        // context.ee.emit('idiomsAvailable', list)
      });

      // unverified for 2.0
      oi.socket.on('testscore', (x) => {
        if (env.log) console.log('testscore', x);
      });

      oi.socket.on('disconnect', comsDisconnect);
      oi.socket.on('connect_error', (data) => {
        comsError(data);
      });
      oi.socket.on('tmx error', (data) => {
        tmxError(data);
      });

      oi.socket.on('tmx_event', () => {
        console.log('tmx_event');
      });
      oi.socket.on('matches', (data) => {
        context.ee.emit('receiveMatches', data);
      });
      oi.socket.on('crowd score', (data) => console.log('crowd score', data));
      oi.socket.on('match score', (data) => console.log('receive score', data));
      oi.socket.on('tournament records', (data) => {
        context.ee.emit('receiveTournamentRecord', data);
      });

      oi.socket.on('auth_org_trnys', (tournaments) => receiveTournaments({ tournaments }));

      oi.socket.on('liveScores', (data) => {
        context.ee.emit('liveScores', data);
      });
      oi.socket.on('liveScore', (data) => {
        context.ee.emit('liveScore', data);
      });

      oi.socket.on('registeredPlayers', (data) => receiveRegisteredPlayers(data));
      oi.socket.on('tournamentCalendar', (data) => receiveTournamentCalendar(data));
    }
  };

  fx.leaveTournament = (tournamentId) => {
    if (connected && tournamentId) {
      fx.emitTmx({ action: 'leaveTournament', payload: { tournamentId } });
    }
  };
  fx.joinTournament = ({ tournamentId }) => {
    if (connected) {
      fx.emitTmx({ action: 'joinTournament', payload: { tournamentId } });
    }
    return connected ? true : false;
  };

  fx.exitLiveScores = ({ ouid }) => {
    return connected ? fx.emitTmx({ exitLiveScores: { ouid } }) : false;
  };

  fx.orgLiveScores = ({ ouid }) => {
    return connected ? fx.emitTmx({ orgLiveScores: { ouid } }) : false;
  };

  fx.deleteMatch = (data) => {
    if (!data || !data.muid || !data.tournamentId) return;
    if (connected) {
      fx.emitTmx({ clientDeletedMatch: data });
    }
  };

  fx.requestTournamentEvents = (tournamentId) => {
    if (connected) {
      const getTrnyEvents = { tournamentId };
      fx.emitTmx({ getTrnyEvents });
    } else {
      const message = `Offline: must be connected to internet`;
      console.log(message);
      // xxx.open({ icon: 'offline', title: i18n.t('phrases.noconnection'), content: message });
    }
  };

  fx.requestTournament = (tournamentId) => {
    if (connected) {
      const data = { tournamentId, timestamp: new Date().getTime(), uuuid: context.uuuid || undefined };
      fx.emitTmx({ tournamentRequest: data });
    } else {
      const message = `Offline: must be connected to internet`;
      console.log(message);
      // xxx.open({ icon: 'offline', title: i18n.t('phrases.noconnection'), content: message });
    }
  };

  fx.requestAcknowledgement = ({ ackId, callback }) => {
    if (ackId) ackRequests[ackId] = callback;
  };

  // takes a promise or async function
  fx.catchAsync = (fn) => (...args) => {
    if (isDev()) {
      return fn(...args);
    } else {
      return fn(...args).catch((err) => fx.logError(err));
    }
  };

  fx.catchSync = (fn, errorAction) => (...args) => {
    if (isDev()) {
      return fn(...args);
    } else {
      try {
        return fn(...args);
      } catch (err) {
        fx.logError(err);
        if (errorAction && typeof errorAction === 'function') {
          errorAction();
        }
      }
    }
  };

  return fx;
})();
