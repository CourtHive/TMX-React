import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStyles } from 'components/tables/styles';
import { useStyles as useIconStyles } from 'components/tables/actions/styles';

import Actions from 'components/tables/actions/Actions';

import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DoneIcon from '@material-ui/icons/AssignmentTurnedInTwoTone';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';

import { useDispatch, useSelector } from 'react-redux';
import CheckboxCell from 'components/tables/common/CheckboxCell';

import NoticePaper from 'components/papers/notice/NoticePaper';
import { AddGroupingButton } from 'components/buttons/addGrouping';

import TMXInput from 'components/inputs/TMXInput';
import TMXIconButton from 'components/buttons/TMXIconButton';
import { Drawer, Grid, IconButton, InputAdornment, Typography } from '@material-ui/core/';

import { filterTableRows, getColumnMenuItems } from 'components/tables/utils';
import EndlessTable from 'components/tables/EndlessTable';
import { GroupEdit } from 'components/tables/groupsTable/GroupEdit/GroupEdit';

import { UUID } from 'functions/UUID';

import { participantRoles, participantTypes } from 'tods-competition-factory';
const { COMPETITOR } = participantRoles;
const { GROUP } = participantTypes;

export const GroupsTable = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();
  const iconClasses = useIconStyles();

  const editState = useSelector((state: any) => state.tmx.editState);

  const ref = useRef(null);
  const searchInput = useRef(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [actions, setActions] = useState(null);
  const [hoverActions, setHoverActions] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [groupData, setGroupData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterValue, setFilterValue] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);
  const hiddenColumns = useSelector((state: any) => state.tmx.hiddenColumns.groups) || [];

  const events = tournamentRecord.events || [];
  const tournamentParticipants = tournamentRecord.participants || [];
  const participantsInEvents = []
    .concat(...events.map((event) => event.entries.map((entry) => entry.participantId)))
    .flat(Infinity);

  const participants = tournamentParticipants.filter((participant) => {
    return (
      (participant.participantRole === COMPETITOR || !participant.participantRole) &&
      participant.participantType === GROUP
    );
  });

  const enteredInEvent = (participantId) => participantsInEvents.includes(participantId);
  const activeParticipantRow = (row) => enteredInEvent(row.id);

  const handleOnClickDelete = () => {
    const participantId = hoverActions?.participantId;
    const participant = tournamentParticipants.find((p) => p.participantId === participantId);
    if (participant) {
      dispatch({
        type: 'alert dialog',
        payload: {
          title: `${t('delete')} ${t('Group')}`,
          content: `${t('delete')} ${participant.name}?`,
          cancel: true,
          okTitle: t('delete'),
          ok: doIt
        }
      });
    }
    function doIt() {
      setHoverActions(null); // cleanup any hover actions
      dispatch({
        type: 'tournamentEngine',
        payload: {
          methods: [
            {
              method: 'deleteParticipants',
              params: { participantIds: [participantId] }
            }
          ]
        }
      });
    }
  };

  const handleOnClickEdit = () => {
    const participantId = hoverActions?.participantId;
    const participant = tournamentParticipants.find((p) => p.participantId === participantId);
    if (participant) {
      setGroupData({ groupParticipant: participant });
    }
  };

  const actionIcons = [
    <EditIcon
      key={1}
      className={iconClasses.actionIcon}
      data-img-selector="actions-wrapper"
      onClick={handleOnClickEdit}
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

  const actionStyles: CSSProperties = hoverActions?.elementDimensions
    ? {
        left: `${hoverActions?.elementDimensions.width - (20 + (actionIcons.length - 1) * 28)}px`,
        position: 'absolute',
        top: `${
          hoverActions?.elementDimensions.top + hoverActions?.index * hoverActions?.elementDimensions.height + 2
        }px`
      }
    : undefined;

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

  const getActionBounds = () => {
    const boundingClient = ref?.current?.getBoundingClientRect();
    const actionAttrs = {
      elementDimensions: {
        top: boundingClient?.top + window.scrollY,
        height: boundingClient?.height,
        width: boundingClient?.width
      }
    };
    setActions(actionAttrs);
  };

  const actionPanelStyle = actions?.elementDimensions
    ? ({
        zIndex: 1,
        position: 'absolute',
        backgroundColor: '#F5F5F5',
        borderRadius: '3px 3px 0 0',
        top: `${actions?.elementDimensions.top}px`,
        height: `${actions?.elementDimensions.height}px`,
        width: `${actions?.elementDimensions.width}px`
      } as CSSProperties)
    : undefined;

  // TODO: combine delete methods similar to how combined in PlayersTable
  const deleteSelectedParticipants = () => {
    const checkedParticipants = tableData.filter((row) => row.checked);
    const participantIds = checkedParticipants.map((row) => row.id);
    const doIt = () => {
      const idsToDelete = participantIds.filter((p) => !enteredInEvent(p.participantId));
      uncheckAllRows();
      setEditMode(false);
      dispatch({
        type: 'tournamentEngine',
        payload: {
          methods: [
            {
              method: 'deleteParticipants',
              params: { participantIds: idsToDelete }
            }
          ]
        }
      });
    };
    dispatch({
      type: 'alert dialog',
      payload: {
        title: `${t('delete')} ${t('Groups')}`,
        content: `${t('delete')} Selected Groups?`,
        cancel: true,
        okTitle: 'Delete',
        ok: doIt
      }
    });
  };

  const exitSelectionMode = () => {
    const updatedFilteredData = filteredData.map((row) => ({ ...row, checked: false }));
    const updatedTableData = data.map((row) => ({ ...row, checked: false }));
    setFilteredData(updatedFilteredData);
    setTableData(updatedTableData);
    setEditMode(false);
  };

  const ActionPanelMenu = () => {
    const checkedParticipants = tableData.filter((row) => row.checked).length;
    const selectedCount = `${checkedParticipants} ${t('Selected')}`;
    return (
      <>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Typography variant="h1" className={classes.itemsCount}>
              {selectedCount}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container alignItems="center" direction="row" justify="flex-end">
              <TMXIconButton
                id="deleteSelected"
                title={t('remove')}
                className={classes.iconMargin}
                onClick={deleteSelectedParticipants}
                icon={<DeleteIcon />}
              />
              <TMXIconButton
                id="exitSelectionMode"
                title={t('Close')}
                className={classes.iconMargin}
                onClick={exitSelectionMode}
                icon={<CloseIcon />}
              />
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  };

  const checkedGroupIds = (tableData?.filter((group) => group.checked) || []).map((p) => p.participantId);

  const data = participants
    .map((participant) => {
      const { participantId } = participant;
      const checked = checkedGroupIds.includes(participantId);
      return {
        checked,
        id: participantId,
        name: participant.name,
        participantId: participantId,
        members: participant.individualParticipants?.length,
        abbreviation: participant.participantProfile?.abbreviation
      };
    })
    .map((participant, i) => ({ ...participant, index: i + 1 }));

  const uncheckAllRows = () => {
    const updatedTableData = tableData.map((row) => ({ ...row, checked: false }));
    setTableData(updatedTableData);
  };

  const addParticipant = () => {
    const groupParticipant = {
      participantId: UUID.new(),
      participantType: GROUP,
      participantRole: COMPETITOR,
      individualParticipants: []
    };
    setGroupData({ groupParticipant });
  };

  const editModeAction = () => setEditMode(!editMode);
  const isHidden = (name) => hiddenColumns.includes(name);

  useEffect(() => {
    const handleResize = () => {
      getActionBounds();
    };

    window.addEventListener('resize', handleResize, false);
    return () => window.removeEventListener('resize', handleResize, false);
  });

  const handleTitleCheckboxToggle = (event) => {
    const toggleRow = (row) => (activeParticipantRow(row) ? false : event.target.checked);
    if (filterValue) {
      const filteredIds = filteredData.map((f) => f.id);
      const updatedFilteredData = filteredData.map((row) => ({
        ...row,
        checked: toggleRow(row)
      }));
      setFilteredData(updatedFilteredData);
      const updatedTableData = data.map((row) => ({
        ...row,
        checked: filteredIds.includes(row.id) ? toggleRow(row) : row.checked
      }));
      setTableData(updatedTableData);
    } else {
      const updatedTableData = data.map((row) => ({
        ...row,
        checked: toggleRow(row)
      }));
      setTableData(updatedTableData);
    }
    getActionBounds();
  };
  const handleCheckBoxToggle = (event, checked, row) => {
    const tableDataItem = data[row.index - 1];
    tableDataItem.checked = !tableDataItem.checked;
    const newTableData = [...data];
    newTableData[row.index - 1] = tableDataItem;
    const mappedDataToFilter = filteredData.map((filteredItem) => {
      return data.find((item) => item?.id === filteredItem.id);
    });

    setFilteredData(mappedDataToFilter);
    setTableData(newTableData);
    getActionBounds();
  };

  const renderCheckboxColumnTitle = () => ({
    node: <CheckboxCell onChange={handleTitleCheckboxToggle} row={0} />,
    className: classes.TableIndexCell
  });
  const renderCheckboxValue = (row) => ({
    node: <CheckboxCell onChange={handleCheckBoxToggle} disabled={activeParticipantRow(row)} row={row} />,
    className: classes.TableIndexCell
  });
  const renderIndexValue = (row) => ({ node: row.index, className: classes.TableIndexCell });
  const renderIndexColumnTitle = () => ({
    node: '#',
    className: `${classes.headerCells} ${classes.TableIndexCell}`
  });

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
      key: 'name',
      getTitle: () => ({ node: t('nm'), className: `${classes.headerCells} ${classes.EPFullNameCell}` }),
      getValue: (row) => ({ node: row.name })
    },
    {
      key: 'abbr',
      getTitle: () => ({ node: t('teams.abbreviation'), className: classes.countColumn }),
      getValue: (row) => ({ node: row.abbreviation }),
      hidden: () => isHidden('abbr')
    },
    {
      key: 'members',
      getTitle: () => ({ node: t('teams.members'), className: classes.countColumn }),
      getValue: (row) => ({ node: row.members }),
      hidden: () => isHidden('members')
    }
  ];

  const visibleColumns = columns.filter((column) => (column.hidden ? !column.hidden() : true));
  const setColumnHiddenState = ({ key }) => {
    dispatch({
      type: 'hide column',
      payload: { table: 'groups', field: key, hidden: !isHidden(key) }
    });
  };

  const columnMenuItems = getColumnMenuItems(columns, setColumnHiddenState).filter(
    (menuItem) => !['checkbox', 'index', 'name'].includes(menuItem.id)
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
    tableHeight: window.innerHeight - 300
  };

  const NotEditingButtonGroup = () => {
    return (
      <>
        <TMXIconButton
          className={editState && classes.iconMargin}
          id="viewColumns"
          title={t('Show Columns')}
          menuItems={columnMenuItems}
          icon={<ViewColumnIcon />}
        />
        {!editState ? null : (
          <TMXIconButton
            title={t('actions.add_team')}
            id="addParticipant"
            onClick={addParticipant}
            className={classes.iconMargin}
            icon={<AddBoxIcon />}
          />
        )}
        {!editState ? null : (
          <TMXIconButton id="moreOptionsMode" onClick={editModeAction} title={t('More')} icon={<MoreVertIcon />} />
        )}
      </>
    );
  };
  const EditingButtonGroup = () => {
    return (
      <>
        <TMXIconButton
          title={t('Done')}
          id="doneEditingParticipants"
          className="doneEditingEventParticipants"
          onClick={editModeAction}
          icon={<DoneIcon />}
        />
      </>
    );
  };

  const filteredRowIds = filteredData.map((row) => row.id);
  const dataForTable = data.filter((row) => {
    return !filterValue.length || filteredRowIds.includes(row.id);
  });
  const rowIsChecked = !!tableData.find((row) => row.checked);

  const showFilterCount = filterValue.length || data.length !== participants.length;
  const filteredCount = `${t('Showing')} ${dataForTable.length} ${t('of')} ${participants.length} ${t('tmz')}`;
  const groupsCount = showFilterCount ? filteredCount : '';

  const closeGroupDrawer = () => {
    setGroupData(false);
  };
  const updateGroup = (updatedgroupParticipant) => {
    closeGroupDrawer();
    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'modifyParticipant',
            params: { participant: updatedgroupParticipant }
          }
        ]
      }
    });
  };

  if (!dataForTable.length && !filterValue) {
    return (
      <>
        <Drawer anchor={'right'} open={Boolean(groupData)} onClose={closeGroupDrawer}>
          <GroupEdit {...groupData} updateGroup={updateGroup} cancel={closeGroupDrawer} />
        </Drawer>
        <NoticePaper className={'info'} style={{ marginTop: '1em' }}>
          <Grid container spacing={2} direction="row" justify="flex-start">
            <Grid item>Prompt to add Group</Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <Grid container direction="row" justify="flex-end">
                <AddGroupingButton onClick={addParticipant} label={t('Add Group')} />
              </Grid>
            </Grid>
          </Grid>
        </NoticePaper>
      </>
    );
  }

  return (
    <>
      <>
        {!rowIsChecked || !editMode ? null : (
          <div style={actionPanelStyle}>
            <ActionPanelMenu />
          </div>
        )}
        <Drawer anchor={'right'} open={Boolean(groupData)} onClose={closeGroupDrawer}>
          <GroupEdit {...groupData} updateGroup={updateGroup} cancel={closeGroupDrawer} />
        </Drawer>
        <Grid ref={ref} container direction="row" justify="space-between">
          <Grid item>
            <Grid container spacing={2} direction="row" justify="flex-start">
              <Grid item xs={12} sm="auto">
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
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row" spacing={2}>
              <Grid item>{editMode ? <EditingButtonGroup /> : <NotEditingButtonGroup />}</Grid>
              <Grid item />
            </Grid>
          </Grid>
        </Grid>
        <Typography variant="h1" className={classes.tablePaperTitle}>
          {groupsCount}
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
          {hoverActions ? (
            <Actions actions={actionIcons} dataImgSelector="actions-wrapper" style={actionStyles} />
          ) : null}
        </div>
      </>
    </>
  );
};
