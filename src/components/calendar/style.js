import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  headerRoot: {
    borderBottom: '1px solid #e8e8e8'
  },
  headerRootPadding: {
    padding: theme.spacing(1.5)
  },
  headerRootPaddingNoBottom: {
    padding: `${theme.spacing(1.5)}px ${theme.spacing(1.5)}px 0 ${theme.spacing(1.5)}px`
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  datePickerRoot: {
    marginTop: '1em',
    marginLeft: '1em',
    float: 'left'
  },
  dateInput: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  menuRightWrapper: {
    height: '100%',
    padding: '10px 25px 10px 0'
  },
  menuRightWrapperSm: {
    height: '100%',
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
    top: '15px',
    right: '10px'
  },
  menuButtonSm: {
    position: 'absolute',
    top: '5px',
    right: '10px'
  },
  pageWrapper: {
    width: '100%',
    padding: '0'
  },
}));