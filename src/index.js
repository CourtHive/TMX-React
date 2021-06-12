import React from 'react';

import { updateReady } from './services/notifications/statusMessages';
import { createEmitter } from 'services/initialization/createEmitter';
import { setupTMX } from './config/initialState';

import * as serviceWorker from './serviceWorker';
import TMX from './components/TMX.jsx';
import { render } from 'react-dom';

if (window.attachEvent) {
  window.attachEvent('onload', setupTMX);
} else {
  if (window.onload) {
    var curronload = window.onload;
    var newonload = function (evt) {
      curronload(evt);
      setupTMX();
    };
    window.onload = newonload;
  } else {
    window.onload = setupTMX;
  }
}

createEmitter();

render(<TMX />, document.getElementById('root'));

function onUpdate(/*registration*/) {
  updateReady();
}

serviceWorker.unregister({ onUpdate });
// serviceWorker.register({ onUpdate });
