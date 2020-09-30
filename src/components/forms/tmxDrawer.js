import React from 'react';
import ReactDOM from 'react-dom';
import Drawer from '@material-ui/core/Drawer';

let ANCHORID = 'drawerAnchor';

export const tmxDrawer = function() {
   let fx = {};

   fx.open = ({
      footer,
      anchor,
      content,
   }={}) => {

      anchor = anchor || getAnchor();
      if (anchor) {
         ReactDOM.render(
            <Drawer
               anchor={'right'}
               open={true}
               onClose={fx.close}
            >
               <div>
                  <div>{content}</div>
               </div>
               <div>{footer}</div>
            </Drawer>
         , anchor);
      }
   }

   fx.close = () => {
      let anchor = document.getElementById(ANCHORID);
      if (anchor) { ReactDOM.unmountComponentAtNode(anchor); }
   };

   function getAnchor() {
      let anchor = document.getElementById(ANCHORID);

      if (!anchor) {
         let el = document.createElement('div');
         el.setAttribute('id', ANCHORID);
         el.setAttribute('style', 'position: absolute;');
         document.body.appendChild(el);
         anchor = document.getElementById(ANCHORID);
      }

      return anchor;
   }

   return fx;
}();
