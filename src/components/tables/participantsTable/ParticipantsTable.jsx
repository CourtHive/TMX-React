import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useStyles } from 'components/tables/styles';
import { useStyles as useIconStyles } from 'components/tables/actions/styles';

// import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// import Penalty from '@material-ui/icons/ErrorOutlineTwoTone';

import { green, red } from '@material-ui/core/colors';

import NoticePaper from 'components/papers/notice/NoticePaper';
import { SyncPlayersButton } from 'components/buttons/syncPlayers';

import { GenderSelector } from 'components/selectors/GenderSelector';
import { TeamSelector } from 'components/selectors/TeamSelector';

import { Drawer, Grid, IconButton, InputAdornment, Typography } from '@material-ui/core/';

import { filterTableRows } from 'components/tables/utils';

import TMXInput from 'components/inputs/TMXInput';
import Actions from 'components/tables/actions/Actions';
import PersonForm from 'components/forms/Person/personForm';

import { generatePlayerTableData } from './participantTableData';
import { ActionPanelMenu } from './ActionPanelMenu';
import { IconButtonGroup } from './IconButtonGroup';
import { AddToGrouping } from './AddToGrouping';

import { AgGridReact } from 'ag-grid-react';
import { useColumnToggle } from 'hooks/useColumnToggle';

import {
  tournamentEngine,
  participantRoles,
  participantTypes,
  participantConstants,
  utilities
} from 'tods-competition-factory';
const { COMPETITOR } = participantRoles;
const { INDIVIDUAL, TEAM, GROUP } = participantTypes;
const { SIGNED_IN, SIGNED_OUT } = participantConstants;

export const ParticipantsTable = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();
  const iconClasses = useIconStyles();

  const {
    state: { participants: hiddenColumns = [] },
    dispatch: columnDispatch
  } = useColumnToggle();

  const NONE = '-';
  // const editState = useSelector((state) => state.tmx.editState);

  const searchInput = useRef(null);
  const actionBoundsRef = useRef(null);
  const tableRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [personData, setPersonData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [hoverActions, setHoverActions] = useState(null);
  const [groupingOpen, setGroupingOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState(false);

  const [gridApi, setGridApi] = useState(null);
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const { tournamentRecord } = tournamentEngine.getState();
  const tournamentParticipants = tournamentRecord.participants || [];
  const { tournamentProfile } = tournamentRecord;

  const events = tournamentRecord.events || [];
  const participantsInEvents = []
    .concat(...events.map((event) => event.entries?.map((entry) => entry.participantId)))
    .flat(Infinity);

  const teamParticipants = tournamentParticipants.filter((participant) => {
    return (
      (participant.participantRole === COMPETITOR || !participant.participantRole) &&
      participant.participantType === TEAM
    );
  });
  const groupParticipants = tournamentParticipants.filter((participant) => {
    return (
      (participant.participantRole === COMPETITOR || !participant.participantRole) &&
      participant.participantType === GROUP
    );
  });

  const selectedTeamId = useSelector((state) => state.tmx.select.players.team);
  const selectedGender = useSelector((state) => state.tmx.select.participants.sex);
  const selectedSignInStatus = useSelector((state) => state.tmx.select.participants.signedIn);
  const signInOutcome = selectedSignInStatus === 'false' || selectedSignInStatus === '-';

  const selectedTeam =
    selectedTeamId !== NONE &&
    (teamParticipants.find((team) => team.participantId === selectedTeamId) ||
      groupParticipants.find((group) => group.participantId === selectedTeamId));
  const teamIds = selectedTeam?.individualParticipantIds || [];
  const selectedGroupingParticipantIds = (teamIds.length && teamIds) || selectedTeam.individualParticipantIds || [];

  const participants = tournamentParticipants.filter((participant) => {
    const isPerson = participant.participantType === INDIVIDUAL || participant.person;
    const isCompetitor = participant.participantRole === COMPETITOR || !participant.participantRole;
    return isPerson && isCompetitor;
  });

  const enteredInEvent = (participantId) => participantsInEvents.includes(participantId);
  const activeParticipantRow = (row) => enteredInEvent(row.id);

  const changeSignInStatus = ({ participantId }) => {
    const participant = tournamentParticipants.find((p) => p.participantId === participantId);
    function signIn({ participantId }) {
      setTimeout(() => {
        const params = { participantIds: [participantId], signInState: SIGNED_IN };
        dispatch({
          type: 'tournamentEngine',
          payload: {
            methods: [
              {
                method: 'modifyParticipantsSignInStatus',
                params
              }
            ]
          }
        });
      }, 300);
    }
    function signOut({ participantId }) {
      setTimeout(() => {
        const params = { participantIds: [participantId], signInState: SIGNED_OUT };
        dispatch({
          type: 'tournamentEngine',
          payload: {
            methods: [
              {
                method: 'modifyParticipantsSignInStatus',
                params
              }
            ]
          }
        });
      }, 300);
    }

    if (participant) {
      const signedIn = tournamentEngine.getParticipantSignInStatus(participant);
      if (signedIn) {
        signOut({ participantId });
      } else {
        signIn({ participantId });
      }
    }
  };

  const deleteAction = (props) => {
    const { participantId } = props;
    let { participantIds } = props;
    const participant = participantId && tournamentParticipants.find((p) => p.participantId === participantId);
    const deleteWhat = participant?.name || t('Selected Participants');

    function doIt() {
      participantIds = participantIds || [participantId];
      setHoverActions(null); // cleanup any hover actions
      setEditMode(false); // after delete exit edit mode
      dispatch({
        type: 'tournamentEngine',
        payload: {
          methods: [
            {
              method: 'deleteParticipants',
              params: { participantIds }
            }
          ]
        }
      });
    }
    if (participantId || participantIds) {
      dispatch({
        type: 'alert dialog',
        payload: {
          title: `${t('delete')} ${t('ply')}`,
          content: `${t('delete')} ${deleteWhat}?`,
          cancel: true,
          okTitle: t('delete'),
          ok: doIt
        }
      });
    }
  };

  const deleteSelectedParticipants = () => {
    const checkedParticipants = tableData.filter((row) => row.checked);
    const participantIds = checkedParticipants.map((row) => row.id);
    deleteAction({ participantIds });
  };

  const handleOnClickEdit = () => {
    const participantId = hoverActions?.participantId;
    const participant = tournamentParticipants.find((p) => p.participantId === participantId);
    function savePlayerEdits({ participantData, groupingParticipantId }) {
      if (participantData) {
        const person = participantData.person;
        const updatedParticipant = Object.assign({}, participant);
        updatedParticipant.participantName = `${person.standardGivenName} ${person.standardFamilyName}`;
        updatedParticipant.person = Object.assign({}, participant.person, person);

        const methods = [
          {
            method: 'modifyParticipant',
            params: { participant: updatedParticipant, groupingParticipantId, removeFromOtherTeams: true }
          }
        ];

        if (!groupingParticipantId) {
          const playerTeam = teamParticipants.find((team) => {
            return team.individualParticipantIds?.includes(participantId);
          });
          if (playerTeam) {
            const newMethod = {
              method: 'removeIndividualParticipantIds',
              params: { groupingParticipantId: playerTeam.participantId, individualParticipantIds: [participantId] }
            };
            methods.push(newMethod);
          }
        }

        dispatch({
          type: 'tournamentEngine',
          payload: { methods }
        });
      }
      setPersonData(false);
    }
    if (participant && participant.person) {
      const person = participant.person;
      if (person) {
        setPersonData({
          person,
          participantId,
          minimumBirthYear: 4,
          maximumBirthYear: 90,
          teamParticipants,
          callback: savePlayerEdits
        });
      }
    }
  };

  const actionIcons = [
    <MoreVertIcon
      key={1}
      className={iconClasses.actionIcon}
      data-img-selector="actions-wrapper"
      onClick={handleOnClickEdit}
    />
  ];

  const actionStyles = hoverActions?.elementDimensions
    ? {
        left: `${window.innerWidth < 750 ? window.innerWidth - 20 : window.innerWidth - 40}px`,
        position: 'absolute',
        top: `${hoverActions?.elementDimensions.top}px`
      }
    : undefined;

  const data = generatePlayerTableData({
    classes,
    tableData,
    participants,
    selectedTeam,
    selectedGender,
    teamParticipants,
    groupParticipants,
    selectedSignInStatus,
    selectedGroupingParticipantIds
  });

  const exitSelectionMode = () => {
    const updatedFilteredData = filteredData.map((row) => ({ ...row, checked: false }));
    const updatedTableData = data.map((row) => ({ ...row, checked: false }));
    setFilteredData(updatedFilteredData);
    setTableData(updatedTableData);
    setEditMode(false);
  };

  const validGenders = ['M', 'F', 'MALE', 'FEMALE'];
  const gendersPresent = (participants || []).reduce((genders, participant) => {
    const { person } = participant || {};
    const sex = person && person.sex && validGenders.includes(person.sex);
    return sex && !genders.includes(person.sex) ? genders.concat(person.sex) : genders;
  }, []);

  const genderMap = {
    M: { text: t('genders.male'), value: 'M' },
    F: { text: t('genders.female'), value: 'F' },
    MALE: { text: t('genders.male'), value: 'M' },
    FEMALE: { text: t('genders.female'), value: 'F' }
  };
  const genderOptions = gendersPresent.map((g) => genderMap[g]).filter((f) => f);

  const uncheckAllRows = () => {
    const updatedTableData = tableData.map((row) => ({ ...row, checked: false }));
    setTableData(updatedTableData);
  };

  const modifyParticipantsSignInState = () => {
    const checkedParticipants = tableData.filter((row) => row.checked);
    // if newState is signedOut (false) then only apply to those participants not active in an event.
    // if newState is signedIn (datetime) then only modify if previously false
    const newSignInState = (p) => (signInOutcome && p.signedIn ? true : signInOutcome);
    const participantsToModify = checkedParticipants.filter(
      (participant) => signInOutcome || !enteredInEvent(participant.participantId)
    );
    participantsToModify.forEach((p) => (p.signedIn = newSignInState(p)));

    const participantIds = participantsToModify.map((participant) => participant.participantId);
    const signInState = signInOutcome ? SIGNED_IN : SIGNED_OUT;
    uncheckAllRows();
    setEditMode(false);

    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'participantsSignInStatus',
            params: { participantIds, signInState }
          }
        ]
      }
    });
  };

  const addParticipant = () => {
    const addToStore = ({ participantData, groupingParticipantId }) => {
      if (participantData) {
        participantData.participantId = utilities.UUID();
        dispatch({
          type: 'tournamentEngine',
          payload: {
            methods: [
              {
                method: 'addParticipants',
                params: { participants: [participantData], groupingParticipantId }
              }
            ]
          }
        });
      }
      setPersonData(false);
    };
    setPersonData({ callback: addToStore, teamParticipants, title: t('actions.add_player') });
  };

  const editModeAction = () => setEditMode(!editMode);
  const isHidden = (name) => hiddenColumns.includes(name);
  const toggleColumnHiddenState = ({ key }) => {
    columnDispatch({ table: 'participants', columnName: key });
    setTimeout(() => gridApi?.resetRowHeights(), 50);
  };

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => gridApi?.resetRowHeights(), 50);
    };

    window.addEventListener('resize', handleResize, false);
    return () => window.removeEventListener('resize', handleResize, false);
  });

  const clickSignIn = (row) => {
    if (row.participantId) changeSignInStatus(row);
  };

  const clickPaid = (row) => {
    if (row.participantId) console.log('PAID', { row });
  };
  function contains(target, lookingFor) {
    return target && target.indexOf(lookingFor) >= 0;
  }
  var countryFilterParams = {
    buttons: ['clear'],
    filterOptions: ['contains'],
    suppressAndOrCondition: true,
    textCustomComparator: function (_, value, filterText) {
      const filterTextLowerCase = filterText.toLowerCase();
      const valueLowerCase = value.toString().toLowerCase();
      const aliases = {
        usa: 'united states',
        holland: 'netherlands',
        england: 'united kingdom',
        oz: 'australia',
        xi: 'china'
      };
      const literalMatch = contains(valueLowerCase, filterTextLowerCase);
      return literalMatch || contains(valueLowerCase, aliases[filterTextLowerCase]);
    },
    trimInput: true,
    debounceMs: 1000
  };

  const SignInStateRenderer = (params) => {
    const status = params.data?.signedIn ? <CheckCircleIcon style={{ color: green[500] }} /> : <NotInterestedIcon />;
    return <div onClick={() => clickSignIn(params.data)}>{status}</div>;
  };
  const PaidStatusRenderer = (params) => {
    const status = params.data?.paid ? (
      <AccountBalanceIcon style={{ color: green[500] }} />
    ) : (
      <ErrorOutlineIcon style={{ color: red[500] }} />
    );
    return <div onClick={() => clickPaid(params.data)}>{status}</div>;
  };
  const frameworkComponents = {
    signInStateRenderer: SignInStateRenderer,
    paidStatusRenderer: PaidStatusRenderer
  };
  const defaultColDef = {
    autoHeight: true,
    sortable: true,
    resizable: true,
    filter: true,
    lockVisible: true,
    floatingFilter: false
  };
  const columnDefs = [
    {
      field: 'checkbox',
      width: 40,
      suppressMenu: true,
      hide: !editMode,
      checkboxSelection: () => true,
      headerCheckboxSelection: () => true,
      headerCheckboxSelectionFilteredOnly: true
    },
    {
      width: 40,
      field: 'signIn',
      suppressMenu: true,
      headerName: '',
      cellStyle: { paddingTop: '5px', paddingLeft: '10px' },
      cellRenderer: 'signInStateRenderer'
    },
    {
      headerName: 'Name',
      field: 'name',
      wrapText: true,
      minWidth: 150,
      initialFlex: 1,
      cellStyle: { paddingRight: '5px' },
      // floatingFilter: true,
      filterParams: {
        buttons: ['reset']
      }
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      hide: isHidden('firstName'),
      filterParams: {
        buttons: ['reset']
      }
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      hide: isHidden('lastName')
    },
    {
      field: 'otherName',
      headerName: 'Other Name',
      hide: isHidden('otherName')
    },
    {
      field: 'sex',
      maxWidth: 120,
      headerName: 'Gender',
      hide: isHidden('sex')
    },
    {
      field: 'teamName',
      headerName: 'Team Name',
      hide: isHidden('teamName')
    },
    {
      field: 'groups',
      headerName: 'Groups',
      hide: isHidden('groups')
    },
    {
      field: 'nationality',
      headerName: 'Nationality',
      hide: isHidden('nationality'),
      filter: 'agTextColumnFilter',
      filterParams: countryFilterParams
    },
    {
      width: 100,
      field: 'paid',
      headerName: 'Paid',
      hide: isHidden('paid'),
      cellStyle: { paddingTop: '5px' },
      cellRenderer: 'paidStatusRenderer'
    }
  ];

  const columnsToFilter = ['checkbox', 'index', 'name'];
  if (selectedSignInStatus !== '-') columnsToFilter.push('signedIn');
  const columnMenuItems = columnDefs
    .filter((col) => !['checkbox', 'index', 'name'].includes(col.field))
    .map((col) => ({
      id: col.field,
      key: col.field,
      text: col.headerName,
      checked: !isHidden(col.field),
      onClick: toggleColumnHiddenState
    }));

  const handleOnChangeFilter = (event) => {
    const targetValue = event?.target?.value;
    setFilterValue(targetValue);
    setFilteredData(filterTableRows(data, undefined, targetValue));
  };

  const filteredRowIds = filteredData.map((row) => row.id);
  const dataForTable = data.filter((row) => {
    return !filterValue.length || filteredRowIds.includes(row.id);
  });

  const showFilterCount = filterValue.length || data.length !== participants.length;
  const filteredCount = `${t('Showing')} ${dataForTable.length} ${t('of')} ${participants.length} ${t('pyr')}`;
  const playersCount = showFilterCount ? filteredCount : '';

  const actionPanelProps = {
    tableData,
    signInOutcome,
    exitSelectionMode,
    activeParticipantRow,
    selectedSignInStatus,
    deleteSelectedParticipants,
    modifyParticipantsSignInState,
    addSelectedParticipantsToGrouping: () => setGroupingOpen(true)
  };

  const iconButtonGroupProps = {
    editMode,
    columnMenuItems,
    addParticipant,
    editModeAction,
    tournamentProfile
  };

  if (!participants.length && !filterValue) {
    return (
      <NoticePaper className={'info'} style={{ marginTop: '1em' }}>
        <Grid container spacing={2} direction="row" justify="flex-start">
          <Grid item>Prompt to add players</Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Grid container direction="row" justify="flex-end">
              <SyncPlayersButton />
            </Grid>
          </Grid>
        </Grid>
      </NoticePaper>
    );
  }

  const onCellMouseOver = (rowData) => {
    const inEvent = participantsInEvents.includes(rowData.participantId);
    const { rowIndex, event } = rowData;
    if (
      rowIndex !== hoverActions?.index &&
      event?.relatedTarget?.getAttribute('data-img-selector') !== 'actions-wrapper'
    ) {
      const width = tableRef?.current?.getBoundingClientRect().width;
      const elementDimensions = {
        top: rowData.event.srcElement.parentElement.getBoundingClientRect().top + window.scrollY,
        height: rowData.event.srcElement.getBoundingClientRect().height,
        width
      };
      setHoverActions({
        inEvent,
        index: rowIndex,
        elementDimensions,
        participantId: rowData.data.participantId
      });
    }
  };
  const onCellMouseOut = (rowData) => {
    const { rowIndex, event } = rowData;
    const canGetAttribute = event?.relatedTarget?.getAttribute;
    if (
      rowIndex === hoverActions?.index &&
      canGetAttribute &&
      event.relatedTarget.getAttribute('data-img-selector') !== 'actions-wrapper'
    ) {
      setHoverActions(null);
    }
  };

  const onSelectionChanged = () => {
    const selectedRows = gridApi.getSelectedRows();
    setSelectedRows(!!selectedRows.length);
  };

  return (
    <>
      <AddToGrouping
        open={groupingOpen}
        tableData={tableData}
        teamParticipants={teamParticipants}
        groupParticipants={groupParticipants}
        onClose={() => setGroupingOpen(false)}
        onSubmit={() => {
          uncheckAllRows();
          setGroupingOpen(false);
        }}
      />
      <Drawer anchor={'right'} open={Boolean(personData)} onClose={() => setPersonData(false)}>
        <PersonForm {...personData} />
      </Drawer>
      <Grid ref={actionBoundsRef} container direction="row" justify="space-between">
        {selectedRows && editMode ? (
          <ActionPanelMenu {...actionPanelProps} />
        ) : (
          <>
            <Grid item>
              <Grid container spacing={2} direction="row" justify="flex-start">
                <Grid item sm="auto">
                  <TMXInput
                    inputRef={searchInput}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton>
                          {' '}
                          <SearchIcon />{' '}
                        </IconButton>
                      </InputAdornment>
                    }
                    onChange={handleOnChangeFilter}
                  />
                </Grid>
                {genderOptions?.length > 0 && (
                  <Grid item sm="auto">
                    <GenderSelector options={genderOptions} />
                  </Grid>
                )}
                {teamParticipants?.length > 0 && (
                  <Grid item sm="auto">
                    <TeamSelector teamContext="players" />
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={2}>
                <Grid item>
                  <IconButtonGroup {...iconButtonGroupProps} />
                </Grid>
                <Grid item />
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
      <Typography variant="h1" className={classes.playersCount}>
        {playersCount}
      </Typography>
      <div className="ag-theme-material" style={{ height: window.innerHeight - 300, width: '100%' }} ref={tableRef}>
        <AgGridReact
          rowData={dataForTable}
          columnDefs={columnDefs}
          frameworkComponents={frameworkComponents}
          defaultColDef={defaultColDef}
          rowSelection={'multiple'}
          onGridReady={onGridReady}
          onCellMouseOver={onCellMouseOver}
          onCellMouseOut={onCellMouseOut}
          suppressCellSelection={true}
          suppressRowClickSelection={true}
          onSelectionChanged={onSelectionChanged}
        ></AgGridReact>
        {hoverActions ? <Actions actions={actionIcons} dataImgSelector="actions-wrapper" style={actionStyles} /> : null}
      </div>
    </>
  );
};
