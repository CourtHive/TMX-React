import { makeStyles, Theme } from '@material-ui/core/styles';
import { BORDERS_GREY, LIGHT_GREEN, LIGHT_RED, TEXT_GREEN, WHITE } from 'theme/colors';

export const useStylesCommon = makeStyles((theme: Theme) => ({
  UMCourtSchedule: {
    height: '100%',
    padding: 0,
    width: '184px',
    '& > div': {
      borderRight: BORDERS_GREY,
      boxSizing: 'border-box'
    },
    '&:last-of-type': {
      borderRight: 'none',
      boxSizing: 'border-box'
    }
  },
  resourceWrapper: {
    backgroundColor: 'rgba(242, 242, 242, 1)',
    height: '100%',
    padding: theme.spacing(1),
    width: '100%'
  },
  emptyResourceWrapper: {
    alignItems: 'center',
    border: '1px ',
    display: 'flex',
    fontWeight: 'bold',
    justifyContent: 'center',
    minHeight: '100%',
    padding: '16px',
    width: '100%'
  },
  lightGreenBackground: {
    background: LIGHT_GREEN
  },
  lightRedBackground: {
    background: LIGHT_RED
  },
  matchContainer: {
    background: WHITE,
    border: BORDERS_GREY,
    borderRadius: '5px',
    height: '132px', // has to be in px because of drag preview
    padding: '10px',
    width: '178px'
  },
  eventNameTypography: {
    fontSize: 12,
    textAlign: 'center'
  },
  liveTimeTypography: {
    color: TEXT_GREEN,
    fontSize: 12,
    fontWeight: 600,
    padding: '3px',
    textAlign: 'center'
  },
  side1Side2Typography: {
    fontSize: 12,
    fontWeight: 500,
    textAlign: 'center'
  },
  UMTableDragHandleCellWrapper: {
    borderLeft: '3px solid black',
    height: '90%'
  },
  UMTableDragHandleCell: {
    height: '42px',
    padding: '8px',
    width: '100%',
    '&:hover': {
      cursor: 'grab'
    }
  },
  UMTableDragHandleCellAssigned: {
    color: 'grey'
  },
  UMCourtsTableConfig: {
    borderRadius: 0,
    borderTop: BORDERS_GREY,
    borderLeft: BORDERS_GREY,
    boxShadow: 'none',
    '& > div': {
      minWidth: 1000
    }
  },
  courtTitleWrapper: {
    padding: '7px'
  },
  courtTitle: {
    fontSize: 16
  },
  courtSubtitle: {
    fontSize: 12
  },
  firstColumn: {
    height: '100%',
    width: '100%'
  },
  firstColumnText: {
    textAlign: 'center'
  },
  paper: {
    maxWidth: 'fit-content',
    padding: 0
  },
  paperHeaderContainer: {
    padding: theme.spacing(2)
  },
  paperHeaderArrowsLeftRight: {
    border: BORDERS_GREY,
    borderRadius: '3px',
    height: '40px',
    width: '44px'
  },
  paperHeaderArrowsLeftRightInner: {
    height: '100%'
  },
  arrows: {
    height: '14px',
    width: '14px'
  },
  viewSelect: {
    '& > div': {
      border: 'none'
    }
  },
  viewSelectContainer: {
    height: '42px'
  },
  checkInFilled: {
    width: '20px'
  },
  cellMenu: {
    padding: '10px'
  }
}));
