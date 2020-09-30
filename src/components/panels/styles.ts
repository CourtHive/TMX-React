import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  iconMargin: {
    marginRight: '.5em'
  },
  noWrap: {
    whiteSpace: 'nowrap'
  },
  sectionTitle: {
    marginBottom: '1em',
  },
  divider: {
    height: '20px',
    width: '100%'
  },
  panelContainer: {
    padding: `${theme.spacing(2)}px 0`
  },
  settingsPanelContainer: {
    margin: theme.spacing(3)
  },
  link: {
    fontSize: 16
  },
  form: {
    margin: 'dense'
  },
  paperStandard: {
    marginBottom: theme.spacing(2)
  },
  paperStandardTitle: {
    paddingBottom: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  select: {
    margin: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  tmxDraws: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  }
}));
