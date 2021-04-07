import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    margin: '1em'
  },
  itemsCount: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(2),
    textOverflow: 'ellipsis'
  },
  playersCount: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  tablePaperTitle: {
    marginBottom: theme.spacing(2)
  },
  tablePaperSubtitle: {
    color: theme.palette.grey['50'],
    marginBottom: theme.spacing(2)
  },
  tableFont: {
    fontSize: 13
  },
  headerStyle: {
    fontWeight: 'bold',
    color: 'blue'
  },
  headerMain: {
    borderBottom: `2px solid ${theme.palette.grey['200']}`
  },
  headerFontStyle: {
    color: theme.typography.body1.color,
    fontSize: 13,
    fontWeight: 600
  },
  tableFontStyle: {
    color: theme.typography.body1.color,
    fontSize: 13
  },
  divider: {
    height: '20px',
    width: '100%'
  },
  RTableConfig: {
    boxShadow: 'none',
    '& > div': {
      minWidth: 1000
    }
  },
  boldContent: {
    fontWeight: 'bold'
  },
  headerCells: {
    padding: `${theme.spacing(2)}px 0!important`
  },
  countColumn: {
    padding: `${theme.spacing(2)}px 0!important`,
    maxWidth: '20px'
  },
  signedInColumn: {
    padding: `${theme.spacing(2)}px 0!important`,
    width: '10px'
  },
  groupsColumn: {
    padding: `${theme.spacing(2)}px 0!important`,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  eventNameColumn: {
    padding: `${theme.spacing(2)}px 0!important`,
    maxWidth: '250px'
  },
  drawsChips: {
    padding: `${theme.spacing(2)}px 0!important`,
    width: '200px'
  },
  selectedRow: {
    background: theme.palette.grey['400']
  },
  // EventParticipants
  paper: {
    position: 'relative'
  },
  EPTableConfig: {
    boxShadow: 'none',
    '& > div': {
      // minWidth: 1000
    }
  },
  EPCellConfig: {
    padding: 0
  },
  TableIndexCell: {
    borderBottom: 'none',
    // textAlign: 'center',
    width: '40px'
  },
  EPFullNameCell: {
    minWidth: '100px'
  },
  EPScaleCell: {
    maxWidth: '20px'
  },
  EPGenderCell: {
    maxWidth: '30px'
  },
  EPTableCellNoWrap: {
    whiteSpace: 'nowrap',
    width: '5%'
  },
  inputMargin: {
    marginRight: '1em'
  },
  iconMargin: {
    marginRight: '.5em'
  },
  buttonIcon: {
    height: '16px',
    marginRight: theme.spacing(1),
    stroke: theme.palette.grey['50'],
    width: 'auto'
  },
  LocationsTableCellConfig: {
    paddingLeft: 0,
    paddingRight: 0
  },
  dragCellTitle: {
    padding: 15,
    width: '10px'
  },
  dragCellIconSVG: {
    display: 'block',
    margin: 'auto'
  },
  male: {
    '& div': {
      color: '#3333cc'
    }
  },
  female: {
    '& div': {
      color: '#ff3399'
    }
  },
  notSignedIn: {
    '& div': {
      opacity: 0.6
    }
  },
  availableParticipants: {
    boxShadow: 'none',
    '& > div': {
      width: 400
    }
  },
  dialogRoot: {
    padding: '35px 30px',
    width: '600px'
  },
  dialogRootXS: {
    padding: '25px 20px'
  }
}));
