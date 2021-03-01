import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(() => ({
  divider: {
    height: '20px',
    width: '100%'
  },
  UMTableConfig: {
    boxShadow: 'none',
    '& > div': {
      minWidth: 1000
    }
  },
  UMCellConfig: {
    padding: 0
  },
  UMTableIndexCell: {
    borderBottom: 'none',
    width: '30px'
  },
  UMTableDragCell: {
    borderLeft: '2px solid black',
    padding: '2px'
  },
  UMTableDragHandleCell: {
    fontSize: '10px',
    minWidth: '40px',
    maxWidth: '40px',
    padding: 0,
    width: '40px'
  },
  courtTitle: {
    borderLeft: 'none',
    borderRight: 'none',
    height: '57px',
    minWidth: '194px',
    textAlign: 'center',
    width: '194px'
  },
  firstColumnCourtsTable: {
    minWidth: '120px',
    width: '120px',
    '& > div': {
      height: '57px'
    }
  },
  UMTableCellNoWrap: {
    whiteSpace: 'nowrap',
    width: '5%'
  },
  UMTableCellTime: {
    width: '15%'
  },
  UMTableCellSides: {
    width: '25%'
  }
}));
