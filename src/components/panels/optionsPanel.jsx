import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStyles } from 'components/panels/styles';

import { Button, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/HighlightOff';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import TMXIconButton from 'components/buttons/TMXIconButton';
import { AdHocRoundSelector } from 'components/selectors/AdHocRound';

export const OptionsPanel = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { drawDefinition, structure, roundMatchUps } = props;

  const drawIsAdHoc = false;
  const drawIsRoundRobin = structure && structure.structures;

  const firstRoundSize = roundMatchUps && roundMatchUps[1] && roundMatchUps[1].length;
  const zoomDraw = firstRoundSize >= 16 && !drawIsAdHoc && !drawIsRoundRobin;

  const AddAdhoc = () => {
    const addAdHocMatch = () => {
      console.log('AddAdHoc');
    };
    return (
      <Button startIcon={<AddIcon />} variant="outlined" onClick={addAdHocMatch}>
        {t('add')}
      </Button>
    );
  };

  const DeleteAdhoc = () => {
    const deleteAdHocRound = () => {
      console.log('delete AdHoc Round');
    };
    return (
      <Button startIcon={<DeleteIcon />} variant="outlined" onClick={deleteAdHocRound}>
        {t('delete')}
      </Button>
    );
  };

  const ZoomDraw = (props) => {
    const { drawDefinition } = props;
    const [zoomState, setZoomState] = React.useState(false);
    const ZoomIcon = () => (zoomState ? <ZoomOutIcon /> : <ZoomInIcon />);

    const zoomDraw = () => {
      const draw = drawDefinition && drawDefinition.draw;

      if (draw) {
        if (zoomState) {
          draw.maxTreeDepth = undefined;
          setZoomState(false);
        } else {
          draw.maxTreeDepth = 3;
          setZoomState(true);
        }
        console.log('display draw with zoom change');
      }
    };
    return (
      <TMXIconButton
        id="zoomState"
        title={t('zoom')}
        onClick={zoomDraw}
        className={classes.iconMargin}
        icon={<ZoomIcon />}
      />
    );
  };

  const DrawMatic = () => {
    const configureDrawMatic = () => {
      console.log('configure DrawMatic');
    };
    return (
      <Button variant="outlined" onClick={configureDrawMatic}>
        DrawMatic
      </Button>
    );
  };

  return (
    <>
      <Grid container spacing={2} direction="row" justify="flex-start">
        <Grid item style={{ flexGrow: 1 }}>
          {drawIsAdHoc && <AdHocRoundSelector drawDefinition={drawDefinition} />}
        </Grid>
        <Grid container item justify={'flex-end'} style={{ flexGrow: 1 }}>
          {zoomDraw && <ZoomDraw drawDefinition={drawDefinition} />}
          {drawIsAdHoc && <AddAdhoc />}
          {drawIsAdHoc && <DeleteAdhoc />}
          {drawIsAdHoc && <DrawMatic />}
        </Grid>
      </Grid>
    </>
  );
};
