import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useStyles } from 'components/tables/styles';
import { useStyles as useIconStyles } from 'components/tables/actions/styles';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import SignInIcon from '@material-ui/icons/EmojiPeople';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
// import Penalty from '@material-ui/icons/ErrorOutlineTwoTone';

import { green, red } from '@material-ui/core/colors';

import NoticePaper from 'components/papers/notice/NoticePaper';
import { SyncPlayersButton } from 'components/buttons/syncPlayers';

import { GenderSelector } from 'components/selectors/GenderSelector';
import { TeamSelector } from 'components/selectors/TeamSelector';

import { Drawer, Grid, IconButton, InputAdornment, Tooltip, Typography } from '@material-ui/core/';

import { filterTableRows, getColumnMenuItems } from 'components/tables/utils';

import TMXInput from 'components/inputs/TMXInput';
import CheckboxCell from 'components/tables/common/CheckboxCell';
import EndlessTable from 'components/tables/EndlessTable';
import Actions from 'components/tables/actions/Actions';
import PersonForm from 'components/forms/Person/personForm';

import { UUID } from 'functions/UUID';

import { generatePlayerTableData } from './playerTableData';
import { ActionPanelMenu } from './ActionPanelMenu';
import { IconButtonGroup } from './IconButtonGroup';
import { AddToGrouping } from './AddToGrouping';
import { getActionPanelBounds } from 'services/dynamicStyles/actionPanelBounds';

import { tournamentEngine, participantRoles, participantTypes, participantConstants } from 'tods-competition-factory';
const { COMPETITOR } = participantRoles;
const { INDIVIDUAL, TEAM, GROUP } = participantTypes;
const { SIGNED_IN, SIGNED_OUT } = participantConstants;

export const PlayersTable = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();
  const iconClasses = useIconStyles();

  const NONE = '-';
  const editState = useSelector((state: any) => state.tmx.editState);

  const searchInput = useRef(null);
  const actionBoundsRef = useRef(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableData, setTableData] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [personData, setPersonData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [hoverActions, setHoverActions] = useState(null);
  const [groupingOpen, setGroupingOpen] = useState(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [actionPanelStyle, setActionPanelStyle] = useState<CSSProperties>({});

  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);
  tournamentEngine.setState(tournamentRecord);

  const tournamentParticipants = tournamentRecord.participants || [];
  const { tournamentProfile } = tournamentRecord;

  const events = tournamentRecord.events || [];
  const participantsInEvents = []
    .concat(...events.map((event) => event.entries.map((entry) => entry.participantId)))
    .flat(Infinity);

  const teamParticipants = tournamentParticipants
    .filter((participant) => {
      return (
        (participant.participantRole === COMPETITOR || !participant.participantRole) &&
        participant.participantType === TEAM
      );
    })
    .map((t) => {
      const participantIds = t.individualParticipants.map((i) => (typeof i === 'object' ? i.participantId : i));
      return Object.assign({}, t, { participantIds });
    });
  const groupParticipants = tournamentParticipants.filter((participant) => {
    return (
      (participant.participantRole === COMPETITOR || !participant.participantRole) &&
      participant.participantType === GROUP
    );
  });

  const selectedTeamId = useSelector((state: any) => state.tmx.select.players.team);
  const hiddenColumns = useSelector((state: any) => state.tmx.hiddenColumns.participants) || [];
  const selectedGender = useSelector((state: any) => state.tmx.select.participants.sex);
  const selectedSignInStatus = useSelector((state: any) => state.tmx.select.participants.signedIn);
  const signInOutcome = selectedSignInStatus === 'false' || selectedSignInStatus === '-';

  const selectedTeam =
    selectedTeamId !== NONE &&
    (teamParticipants.find((team) => team.participantId === selectedTeamId) ||
      groupParticipants.find((group) => group.participantId === selectedTeamId));
  const teamIds = selectedTeam?.participantIds || [];
  const selectedGroupingParticipantIds = (teamIds.length && teamIds) || selectedTeam.individualParticipants || [];

  const participants = tournamentParticipants.filter((participant) => {
    const isPerson = participant.participantType === INDIVIDUAL || participant.person;
    const isCompetitor = participant.participantRole === COMPETITOR || !participant.participantRole;
    return isPerson && isCompetitor;
  });

  const enteredInEvent = (participantId) => participantsInEvents.includes(participantId);
  const activeParticipantRow = (row) => enteredInEvent(row.id);

  const handleOnClickSignIn = () => {
    const participantId = hoverActions?.participantId;
    const participant = tournamentParticipants.find((p) => p.participantId === participantId);
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
  };

  const handleOnClickDelete = () => {
    const participantId = hoverActions?.participantId;
    deleteAction({ participantId });
  };

  const deleteSelectedParticipants = () => {
    const checkedParticipants = tableData.filter((row) => row.checked);
    const participantIds = checkedParticipants.map((row) => row.id);
    deleteAction({ participantIds });
  };

  const handleOnClickEdit = () => {
    const participantId = hoverActions?.participantId;
    const participant = tournamentParticipants.find((p) => p.participantId === participantId);
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
    function savePlayerEdits({ participantData, teamId }) {
      if (participantData) {
        const person = participantData.person;
        const updatedParticipant = Object.assign({}, participant);
        updatedParticipant.name = `${person.standardGivenName} ${person.standardFamilyName}`;
        updatedParticipant.person = Object.assign({}, participant.person, person);

        dispatch({
          type: 'tournamentEngine',
          payload: {
            methods: [
              {
                method: 'modifyParticipant',
                params: { participant: updatedParticipant, teamId }
              }
            ]
          }
        });
      }
      setPersonData(false);
    }
  };

  const actionIcons = [
    <EditIcon
      key={1}
      className={iconClasses.actionIcon}
      data-img-selector="actions-wrapper"
      onClick={handleOnClickEdit}
    />,
    <SignInIcon
      key={2}
      className={iconClasses.actionIcon}
      data-img-selector="actions-wrapper"
      onClick={handleOnClickSignIn}
    />
  ];

  if (!hoverActions?.inEvent) {
    actionIcons.push(
      <DeleteIcon
        key={3}
        className={iconClasses.actionIcon}
        data-img-selector="actions-wrapper"
        onClick={handleOnClickDelete}
      />
    );
  }

  const handleOnRowMouseOver = (event, rowItem, rowIndex) => {
    if (editMode || !editState) return;
    const inEvent = participantsInEvents.includes(rowItem.participantId);
    if (
      rowIndex !== hoverActions?.index &&
      event?.relatedTarget?.getAttribute('data-img-selector') !== 'actions-wrapper'
    ) {
      const width = tableRef?.current?.getBoundingClientRect().width;
      setHoverActions({
        inEvent,
        index: rowIndex,
        elementDimensions: {
          top: event.currentTarget.parentElement.getBoundingClientRect().top + window.scrollY,
          height: event.currentTarget.getBoundingClientRect().height,
          width
        },
        participantId: rowItem.participantId
      });
    }
  };
  const handleOnMouseOut = (event, _, rowIndex) => {
    const canGetAttribute = event?.relatedTarget?.getAttribute;
    if (
      rowIndex === hoverActions?.index &&
      canGetAttribute &&
      event.relatedTarget.getAttribute('data-img-selector') !== 'actions-wrapper'
    ) {
      setHoverActions(null);
    }
  };

  const actionStyles: CSSProperties = hoverActions?.elementDimensions
    ? {
        left: `${hoverActions?.elementDimensions.width - (20 + (actionIcons.length - 1) * 28)}px`,
        position: 'absolute',
        top: `${
          hoverActions?.elementDimensions.top + hoverActions?.index * hoverActions?.elementDimensions.height + 2
        }px`
      }
    : undefined;

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
    const addToStore = ({ participantData, teamId }) => {
      if (participantData) {
        participantData.participantId = UUID.new();
        dispatch({
          type: 'tournamentEngine',
          payload: {
            methods: [
              {
                method: 'addParticipants',
                params: { participants: [participantData], teamId }
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

  const triggerActionPanelStyle = () => {
    const { style: actionStyle } = getActionPanelBounds(actionBoundsRef);
    const style = actionStyle as CSSProperties;
    setActionPanelStyle(style);
  };

  useEffect(() => {
    const handleResize = () => {
      triggerActionPanelStyle();
    };

    window.addEventListener('resize', handleResize, false);
    return () => window.removeEventListener('resize', handleResize, false);
  });

  const handleTitleCheckboxToggle = (event) => {
    const toggleRow = () => event.target.checked;
    if (filterValue) {
      const newFilteredData = filteredData.map((row) => ({ ...row, checked: toggleRow() }));
      setFilteredData(newFilteredData);

      const filteredIds = filteredData.map((f) => f.id);
      const filterToggleRow = (row) => {
        return filteredIds.includes(row.id) ? toggleRow() : row.checked;
      };
      const newTableData = data.map((row) => ({ ...row, checked: filterToggleRow(row) }));
      setTableData(newTableData);
    } else {
      const newTableData = data.map((row) => ({ ...row, checked: toggleRow() }));
      setTableData(newTableData);
    }
    triggerActionPanelStyle();
  };

  const handleCheckBoxToggle = (_, __, row) => {
    const { id } = row;
    const tableDataIndex = data.findIndex((d) => d.id === id);
    const tableDataItem = data[tableDataIndex];
    tableDataItem.checked = !tableDataItem.checked;
    const newTableData = data.map((item) => {
      return item.id === id ? tableDataItem : item;
    });
    newTableData[tableDataIndex] = tableDataItem;
    const mappedDataToFilter = filteredData.map((filteredItem) => {
      return data.find((item) => item?.id === filteredItem.id);
    });

    setFilteredData(mappedDataToFilter);
    setTableData(newTableData);
    triggerActionPanelStyle();
  };

  const renderCheckboxColumnTitle = () => ({
    node: <CheckboxCell onChange={handleTitleCheckboxToggle} row={0} />,
    className: classes.TableIndexCell
  });
  const renderCheckboxValue = (row) => ({
    node: <CheckboxCell onChange={handleCheckBoxToggle} row={row} />,
    className: classes.TableIndexCell
  });
  const renderIndexValue = (row) => ({ node: row.index, className: classes.TableIndexCell });
  const renderIndexColumnTitle = () => ({
    node: '#',
    className: `${classes.headerCells} ${classes.TableIndexCell}`
  });

  const clickSignIn = (row) => console.log('click', { row });
  const renderSignedIn = (row) => {
    const status = row.signedIn ? <CheckCircleIcon style={{ color: green[500] }} /> : <NotInterestedIcon />;
    const node = (
      <div style={{ paddingLeft: '.5em' }} onClick={() => clickSignIn(row)}>
        {status}
      </div>
    );
    return { node };
  };

  const renderPaid = (row) => {
    const status = row.paid ? (
      <AccountBalanceIcon style={{ color: green[500] }} />
    ) : (
      <ErrorOutlineIcon style={{ color: red[500] }} />
    );
    const node = <div>{status}</div>;
    return { node };
  };

  const renderSignedInTitle = () => {
    return {
      node: (
        <Tooltip title={t('Signed In')}>
          <IconButton>
            <CheckCircleIcon />
          </IconButton>
        </Tooltip>
      ),
      className: classes.signedInColumn
    };
  };

  const columns = [
    {
      key: 'checkbox',
      getTitle: renderCheckboxColumnTitle,
      getValue: renderCheckboxValue,
      hidden: () => !editMode
    },
    {
      key: 'index',
      getTitle: renderIndexColumnTitle,
      getValue: renderIndexValue
    },
    {
      key: 'signedIn',
      getTitle: renderSignedInTitle,
      getValue: renderSignedIn,
      hidden: () => isHidden('signedIn') || selectedSignInStatus !== '-'
    },
    {
      key: 'name',
      getTitle: () => ({ node: t('nm'), className: `${classes.headerCells} ${classes.EPFullNameCell}` }),
      getValue: (row) => ({ node: row.name })
    },
    {
      key: 'sex',
      getTitle: () => ({ node: t('gdr'), className: classes.countColumn }),
      getValue: (row) => ({ node: row.sex }),
      hidden: () => isHidden('sex')
    },
    {
      key: 'firstName',
      getTitle: () => ({ node: 'First Name', className: classes.headerCells }),
      getValue: (row) => ({ node: row.firstName }),
      hidden: () => isHidden('firstName')
    },
    {
      key: 'lastName',
      getTitle: () => ({ node: 'Last Name', className: classes.headerCells }),
      getValue: (row) => ({ node: row.lastName }),
      hidden: () => isHidden('lastName')
    },
    {
      key: 'otherName',
      getTitle: () => ({ node: 'Other Name', className: classes.headerCells }),
      getValue: (row) => ({ node: row.otherName }),
      hidden: () => isHidden('otherName')
    },
    {
      key: 'teamName',
      getTitle: () => ({ node: t('team'), className: classes.headerCells }),
      getValue: (row) => ({ node: row.teamName }),
      hidden: () => isHidden('teamName') || teamIds.length
    },
    {
      key: 'groups',
      getTitle: () => ({ node: t('Groups'), className: classes.groupsColumn }),
      getValue: (row) => ({ node: row.groups, className: classes.groupsColumn }),
      hidden: () => isHidden('groups')
    },
    {
      key: 'nationality',
      getTitle: () => ({ node: t('cnt'), className: classes.headerCells }),
      getValue: (row) => ({ node: row.nationality }),
      hidden: () => isHidden('nationality')
    },
    {
      key: 'paid',
      getTitle: () => ({ node: t('Paid'), className: classes.countColumn }),
      getValue: renderPaid,
      hidden: () => isHidden('paid')
    }
  ];

  const visibleColumns = columns.filter((column) => (column.hidden ? !column.hidden() : true));
  const setColumnHiddenState = ({ key }) => {
    dispatch({
      type: 'hide column',
      payload: { table: 'participants', field: key, hidden: !isHidden(key) }
    });
  };

  const columnsToFilter = ['checkbox', 'index', 'name'];
  if (selectedSignInStatus !== '-') columnsToFilter.push('signedIn');
  const columnMenuItems = getColumnMenuItems(columns, setColumnHiddenState).filter(
    (menuItem) => !columnsToFilter.includes(menuItem.id)
  );

  const handleOnChangeFilter = (event) => {
    const targetValue = event?.target?.value;
    setFilterValue(targetValue);
    setFilteredData(filterTableRows(data, visibleColumns, targetValue));
  };

  const cellConfig = {
    className: classes.EPCellConfig
  };
  const getRowSize = () => 48;
  const isDraggableRow = () => false;
  const rowConfig = {
    draggableRow: isDraggableRow,
    rowSize: getRowSize
  };
  const tableConfig = {
    className: classes.EPTableConfig,
    tableHeight: window.innerHeight - 330
  };

  function signIn({ participantId }) {
    setTimeout(() => {
      const params = { participantIds: [participantId], signInState: SIGNED_IN };
      dispatch({
        type: 'tournamentEngine',
        payload: {
          methods: [
            {
              method: 'participantsSignInStatus',
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
              method: 'participantsSignInStatus',
              params
            }
          ]
        }
      });
    }, 300);
  }

  const filteredRowIds = filteredData.map((row) => row.id);
  const dataForTable = data.filter((row) => {
    return !filterValue.length || filteredRowIds.includes(row.id);
  });
  const rowIsChecked = !!tableData.find((row) => row.checked);

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

  return (
    <>
      {!rowIsChecked || !editMode ? null : (
        <div style={actionPanelStyle}>
          <ActionPanelMenu {...actionPanelProps} />
        </div>
      )}
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
      </Grid>
      <Typography variant="h1" className={classes.playersCount}>
        {playersCount}
      </Typography>
      <div style={{ marginBottom: '1em' }} />
      <div ref={tableRef}>
        <EndlessTable
          cellConfig={cellConfig}
          columns={visibleColumns}
          data={dataForTable}
          id={'participantsTable'}
          onRowMouseOver={handleOnRowMouseOver}
          onRowMouseOut={handleOnMouseOut}
          rowConfig={rowConfig}
          tableConfig={tableConfig}
        />
        {hoverActions ? <Actions actions={actionIcons} dataImgSelector="actions-wrapper" style={actionStyles} /> : null}
      </div>
    </>
  );
};
