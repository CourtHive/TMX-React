import { db } from 'services/storage/db';
import { exportCSV } from './exportCSV';
import { getWindow } from 'functions/browser';

import { utilities } from 'tods-competition-factory';
const { dateTime } = utilities;
const { getDateByWeek } = dateTime;

export const exportFx = (function () {
  const exp = {};

  function download(filename, dataStr) {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.setAttribute('href', dataStr);
    a.setAttribute('download', filename);
    const elem = document.body.appendChild(a);
    elem.click();
    elem.remove();
  }

  exp.downloadJSON = (filename, json) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json));
    download(filename, dataStr);
  };

  exp.downloadText = (filename, text) => {
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
    download(filename, dataStr);
  };

  /*
   exp.downloadURI = (uri, name) => {
      let link = document.createElement("a");
      link.download = name;
      link.href = uri;

      let elem = document.body.appendChild(link);
      elem.click();
      elem.remove();
   };

   exp.SVGasURI = (selector, images=[], min_height) => {
      return new Promise((resolve, reject) => {
         let svgnode = selector.tagName.toLowerCase() === 'svg' ? selector : selector.querySelector('svg');
         let svg_string = exp.getSVGString(svgnode);
         exp.svgString2DataURL({ svg_string, images, min_height }).then(resolve, reject);
      });
   };

   exp.saveSVGasPNG = ({ selector, filename = 'svg.png', images }) => {
      let svgnode = selector.tagName.toLowerCase() === 'svg' ? selector : selector.querySelector('svg');
      let svg_string = exp.getSVGString(svgnode);
      let saveImage = (image) => exp.downloadURI(image, filename);

      exp.svgString2DataURL({ svg_string, images }).then(saveImage);
   };
   */

  exp.saveBlob = (blob, fileName) => {
    const url = getWindow().URL.createObjectURL(blob);

    const anchorElem = document.createElement('a');
    anchorElem.style = 'display: none';
    anchorElem.href = url;
    anchorElem.download = fileName;

    document.body.appendChild(anchorElem);
    anchorElem.click();

    document.body.removeChild(anchorElem);

    // On Edge, revokeObjectURL should be called only after
    // a.click() has completed, atleast on EdgeHTML 15.15048
    setTimeout(function () {
      getWindow().URL.revokeObjectURL(url);
    }, 1000);
  };

  /************************* Database Table Export **************************/
  const tableJSON = (table) =>
    db.findAll(table).then((arr) => {
      exp.downloadJSON(`${table}.json`, arr);
    });

  exp.settingsJSON = () => tableJSON('settings');
  exp.clubsJSON = () => tableJSON('clubs');

  exp.tournamentsJSON = (clean = true) => {
    db.findAll('tournaments').then((arr) => {
      if (clean) {
        arr.forEach((a) => {
          delete a.events;
          delete a.players;
          delete a.registered;
          delete a.matches;
        });
        exp.downloadJSON(`tournaments.json`, arr);
      } else {
        // eslint-disable-next-line
        exp.downloadJSON(`tournaments.json`, arr);
      }
    });
  };

  exp.downloadRankings = (rankings) => {
    if (!rankings) {
      db.findAllRankings().then((rankings) => rankings.forEach(download));
    } else {
      db.findAllClubs().then(processCategories, (err) => console.log({ err }));
    }

    function processCategories(clubs) {
      const clubsobj = Object.assign({}, ...clubs.map((c) => ({ [c.id]: c })));
      const cats = rankings.categories;
      Object.keys(cats).forEach((category) => {
        const players = [].concat(...convert(cats[category].M, 'M'), ...convert(cats[category].W, 'F'));
        const ranking = {
          category,
          date: getDateByWeek(rankings.week, rankings.year).getTime(),
          players: Object.assign({}, ...players)
        };
        download(ranking);
      });
      function convert(list, sex) {
        return list.map((m, i) => {
          m.ranking = i + 1;
          m.sex = sex;
          m.club_code = clubsobj[m.club] && clubsobj[m.club].code;
          m.club_name = clubsobj[m.club] && clubsobj[m.club].name;
          m.points = (m.points && m.points.total) || m.points;
          // add club code and club name
          return { [m.id]: m };
        });
      }
    }

    function download(ranking) {
      const data = Object.keys(ranking.players).map((k) => ranking.players[k]);
      exp.downloadJSON(`rankings_${ranking.category}`, data);
    }
  };

  exp.downloadMatches = (category, group_size = 600) => {
    db.findAllMatches().then((matches) => {
      let cursor = 0;
      const category_matches = category ? matches.filter((m) => m.tournament.category === category) : matches;
      removePointsRankings(category_matches);
      removeExtraneous(matches);
      while (cursor < category_matches.length) {
        exp.downloadJSON(
          `${category ? 'U' : '12-S'}${category || ''}-matches.json`,
          category_matches.slice(cursor, cursor + group_size)
        );
        cursor += group_size;
      }
    });
  };

  function removeExtraneous(matches) {
    matches.forEach((matchUp) => {
      delete matchUp.outcome;
      delete matchUp.dependent;
    });
  }
  function removePointsRankings(matches) {
    matches.forEach((matchUp) =>
      matchUp.players.forEach((player) => {
        delete player.points;
        delete player.rankings;
      })
    );
  }

  exp.downloadPoints = (category, group_size = 700) => {
    db.findAllPoints().then((points) => {
      let cursor = 0;
      const category_points = category ? points.filter((p) => p.category === category) : points;
      while (cursor < category_points.length) {
        exp.downloadJSON(`${category || '12-S'}-points.json`, category_points.slice(cursor, cursor + group_size));
        cursor += group_size;
      }
    });
  };

  exp.downloadArray = (filename, array, group_size = 700) => {
    let cursor = 0;
    while (cursor < array.length) {
      exp.downloadJSON(filename, array.slice(cursor, cursor + group_size));
      cursor += group_size;
    }
  };

  exp.downloadRankLists = (ranklists) => ranklists.forEach(exp.rankListCSV);

  exp.rankListCSV = (ranklist) => {
    ranklist.list.forEach((player) => (player.points = player.points.total));
    const csv = exportCSV.json2csv(ranklist.list);
    exp.downloadText(`${ranklist.year}-Week${ranklist.week}-${ranklist.category}-${ranklist.gender}.csv`, csv);
  };

  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  exp.b64toBlob = b64toBlob;
  function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  /*
   exp.getSVGString = getSVGString;
   function getSVGString( svgNode ) {
      svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
      var cssStyleText = getCSSStyles( svgNode );
      appendCSS( cssStyleText, svgNode );

      var serializer = new XMLSerializer();
      var svgString = serializer.serializeToString(svgNode);
      svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
      svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

      return svgString;

      function getCSSStyles( parentElement ) {
         let selectorTextArr = [];

         // Add Parent element Id and Classes to the list
         selectorTextArr.push( '#'+parentElement.id );
         for (let c = 0; c < parentElement.classList.length; c++)
               if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
                  selectorTextArr.push( '.'+parentElement.classList[c] );

         // Add Children element Ids and Classes to the list
         let nodes = parentElement.getElementsByTagName("*");
         for (let i = 0; i < nodes.length; i++) {
            let id = nodes[i].id;
            if ( !contains('#'+id, selectorTextArr) )
               selectorTextArr.push( '#'+id );

            let classes = nodes[i].classList;
            for (let c = 0; c < classes.length; c++)
               if ( !contains('.'+classes[c], selectorTextArr) )
                  selectorTextArr.push( '.'+classes[c] );
         }

         // Extract CSS Rules
         let extractedCSSText = "";
         for (let i = 0; i < document.styleSheets.length; i++) {
            let s = document.styleSheets[i];
            
            try {
               if(!s.cssRules) continue;
            } catch( e ) {
               if(e.name !== 'SecurityError') throw e; // for Firefox
               continue;
            }

            let cssRules = s.cssRules;
            for (let r = 0; r < cssRules.length; r++) {
               if ( contains( cssRules[r].selectorText, selectorTextArr ) )
                  extractedCSSText += cssRules[r].cssText;
            }
         }
         

         return extractedCSSText;

         function contains(str,arr) {
            return arr.indexOf( str ) === -1 ? false : true;
         }

      }

      function appendCSS( cssText, element ) {
         var styleElement = document.createElement("style");
         styleElement.setAttribute("type","text/css"); 
         styleElement.innerHTML = cssText;
         var refNode = element.hasChildNodes() ? element.children[0] : null;
         element.insertBefore( styleElement, refNode );
      }
   }

   exp.svgString2DataURL = svgString2DataURL;
   function svgString2DataURL({ svg_string, images=[], min_height }) {
      return new Promise( (resolve, reject) => {
         var canvas = document.createElement('canvas');
         var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svg_string ) ) ); // Convert SVG string to data URL

         var image = new Image();
         image.onload = function () {
            canvas.width = this.naturalWidth;
            canvas.height = min_height ? Math.max(this.naturalHeight, min_height) : this.naturalHeight;
            canvas.getContext('2d').drawImage(this, 0, 0);

            if (images.length) {
               Promise.all(images.map(imageObj => add2canvas(canvas, imageObj))).then(() => resolve(canvas.toDataURL('image/png'), reject));
            } else {
               resolve(canvas.toDataURL('image/png'));
            }
         };

         image.src = imgsrc;
      });
   }

   exp.add2canvas = add2canvas;
   function add2canvas(canvas, imageObj) {
      return new Promise( (resolve, reject) => {
         if (!imageObj || typeof imageObj !== 'object') return reject();
         var x = imageObj.x && canvas.width ? (imageObj.x >=0 ? imageObj.x : canvas.width + imageObj.x) : 0;
         var y = imageObj.y && canvas.height ? (imageObj.y >=0 ? imageObj.y : canvas.height + imageObj.y) : 0;
         var image = new Image();
         image.onload = function () {
            canvas.getContext('2d').drawImage(this, x, y);
            resolve();
         };

         image.src = imageObj.src;
      });
   }
   */

  exp.matchExportOptions = (/*{ container, tournament, env }*/) => {
    /*
      let { completed_matches } = tournamentEventMatches({ tournament, env });
      let buttons = [];
      if (env.exports.utr) { buttons.push({ label: 'UTR', intent: 'success', onClick: exportUTR }); }
      if (env.exports.statCrew) { buttons.push({ label: 'StatCrew', intent: 'success', onClick: exportSC }); }
      // let title = `${i18n.t('phrases.export')}: ${i18n.t('mts')}`;
      if (buttons.length) {
         buttons.push({ label: i18n.t('tournaments.close'), intent: 'primary' });
         // xxx.open({ icon: 'download', title, content: '', buttons});
      } else {
         buttons.push({ label: i18n.t('tournaments.close'), intent: 'primary' });
         // xxx.open({ icon: 'info-sign', title, content: 'No Export Formats Available', buttons});
      }

      function exportUTR() { exportCSV.downloadUTRmatches(tournament, completed_matches); }
      function exportSC() {
         let xtg = exportXML.statCrew({tournament, env});
         coms.emitTmx({ notice: `StatCrew Export: ${tournament.name}`, });
         exp.downloadText(`${camelize(tournament.name)}.xtg`, xtg);
      }
      */
  };

  return exp;
})();
