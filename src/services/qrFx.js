import React from 'react';
import i18n from 'i18next';
import George from 'qrious'; // he's curious...
import { tmxStore } from 'stores/tmxStore';

export const qrFx = (function () {
  let fx = {};

  fx.displayQRdialogue = (value, downloadName) => {
    if (!value) return;
    var qruri = fx.getQRuri({ value, qr_dim: 250 });
    const QRCODE = () => <img src={qruri.src} alt="qrcode" />;
    const content = () => (
      <div style={{ padding: '1em' }}>
        <div className="flexcenter flexrow" style={{ width: '100%', marginTop: '.5em', marginBottom: '.5em' }}>
          <QRCODE />
        </div>
      </div>
    );

    function downloadQRcode() {
      let filename = `${downloadName || 'tournamentQR'}.png`;
      var qruri = fx.getQRuri({ value, qr_dim: 500 });
      downloadURI(qruri.src, filename);
    }

    tmxStore.dispatch({
      type: 'alert dialog',
      payload: {
        title: i18n.t('phrases.qrcode'),
        cancel: true,
        okTitle: i18n.t('dl'),
        ok: downloadQRcode,
        render: content
      }
    });
  };

  fx.genQUR = (value) => {
    new George({
      element: document.getElementById('qr'),
      level: 'H',
      size: 200,
      value: value
    });
  };

  fx.getQRuri = ({ value, qr_dim, x_offset = 0, y_offset = 0 }) => {
    var xx = new George({
      level: 'H',
      size: qr_dim,
      value: value
    });
    var qdu = xx.toDataURL();

    return { src: qdu, x: qr_dim * x_offset, y: qr_dim * y_offset };
  };

  function downloadURI(uri, name) {
    let link = document.createElement('a');
    link.download = name;
    link.href = uri;

    let elem = document.body.appendChild(link);
    elem.click();
    elem.remove();
  }

  return fx;
})();
