import React from 'react';
import { render } from 'react-dom';
import * as serviceWorker from './serviceWorker';

import TMX from './components/TMX.jsx';
import { setupTMX } from './config/initialState';
import { updateReady } from './services/notifications/statusMessages';

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

render(<TMX />, document.getElementById('root'));

function onUpdate(/*registration*/) {
  updateReady();
}

serviceWorker.unregister({ onUpdate });
// serviceWorker.register({ onUpdate });
