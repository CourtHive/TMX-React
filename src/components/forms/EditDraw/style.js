import { makeStyles } from '@material-ui/core';
import { grey, blue } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
  root: {
    margin: '1em',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200
    }
  },
  paperStandard: {
    marginBottom: theme.spacing(2)
  },
  paperStandardTitle: {
    paddingBottom: theme.spacing(1)
  },
  matchFormatList: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
    paddingInlineStart: 0,
    listStyle: 'none'
  },
  grow: {
    flexGrow: 1
  },
  matchUpFormat: {
    padding: 0
  },
  displayDraw: {
    display: 'flex',
    padding: '1em',
    flexDirection: 'column',
    alignItems: 'left',
    marginBottom: theme.spacing(1),
    backgroundColor: grey[50],
    minHeight: '100px'
  },
  formTitle: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: grey[50]
  },
  tableContainer: {
    backgroundColor: grey[50]
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  editField: {
    margin: theme.spacing(1)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  gender: {
    margin: theme.spacing(3)
  },
  scoringFormat: {
    marginTop: theme.spacing(3),
    margin: theme.spacing(1),
    width: 300
  },
  submit: {
    color: 'white',
    backgroundColor: blue[500],
    margin: theme.spacing(2),
    width: 200,
    '&:hover': { backgroundColor: 'green' }
  },
  editPanel: {
    height: '100%',
    margin: theme.spacing(3)
  }
}));
