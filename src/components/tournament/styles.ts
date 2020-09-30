import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20
  },
  breadcrumb: {
    display: 'flex',
    fontSize: 16,
    marginBottom: '1em'
  },
  headerRoot: {
    borderBottom: '1px solid #e8e8e8'
  },
  headerRootPadding: {
    padding: theme.spacing(1.5),
    borderBottom: '1px solid #e8e8e8'
  },
  headerRootPaddingNoBottom: {
    padding: `${theme.spacing(1.5)}px ${theme.spacing(1.5)}px 0 ${theme.spacing(1.5)}px`
  },
  root: {
    flexGrow: 1,
    width: '100%',
    padding: theme.spacing(1)
  },
  pageWrapper: {
    height: '100%',
    width: '100%',
    padding: '0'
  },
  actionIcon: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2)
  },
  tabPanel: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2)
  },
  menuRightWrapper: {
    height: '100%',
    // padding: '10px 75px 10px 0'
  },
  menuRightSubWrapper: {
    alignSelf: 'center',
    // padding: '0 10px',
    '& > div': {
      height: '100%'
    }
  },
  menuRightWrapperSm: {
    height: '100%'
  },
  menuRight: {
    height: '100%',
    padding: '0 10px 0 0'
  },
  menuItemPaddingRight: {
    paddingRight: '10px'
  },
  menuImage: {
    margin: 'auto',
    height: 'auto',
    maxHeight: '50px',
    width: 'auto',
    maxWidth: '120px'
  },
  menuImageXs: {
    margin: 'auto',
    height: 'auto',
    maxHeight: '50px',
    width: 'auto',
    maxWidth: '100px'
  },
  menuButton: {
    position: 'absolute',
    top: '24px',
    right: '10px'
  },
  menuButtonSm: {
    position: 'absolute',
    top: '5px',
    right: '10px'
  },
  logoDivider: {
    margin: '0 10px'
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  tournamentName: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  button: {
    margin: theme.spacing(1)
  },
  form: {
    margin: 'dense'
  },
  tab: {
    minWidth: '40px!important',
    fontSize: '14px!important',
    textTransform: 'none',
//     padding: '0 12px'
  },
  tabSm: {
    minWidth: '40px!important',
    fontSize: '12px!important'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    width: '100%',
    height: '100%',
    // backgroundColor: '#F8F8F8',
    backgroundColor: 'white'
  },
  navColumn: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));
