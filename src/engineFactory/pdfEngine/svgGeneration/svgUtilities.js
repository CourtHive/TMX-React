export function SVGasURI(selector, images=[], min_height) {
  return new Promise((resolve, reject) => {
     let svgnode = selector.tagName.toLowerCase() === 'svg' ? selector : selector.querySelector('svg');
     let svg_string = getSVGString(svgnode);
     svgString2DataURL({ svg_string, images, min_height }).then(resolve, reject);
  });
};

export function saveSVGasPNG({ selector, filename = 'svg.png', images }) {
  let svgnode = selector.tagName.toLowerCase() === 'svg' ? selector : selector.querySelector('svg');
  let svg_string = getSVGString(svgnode);
  let saveImage = (image) => downloadURI(image, filename);

  svgString2DataURL({ svg_string, images }).then(saveImage);
};

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

function downloadURI(uri, name) {
   let link = document.createElement("a");
   link.download = name;
   link.href = uri;

   let elem = document.body.appendChild(link);
   elem.click();
   elem.remove();
};

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