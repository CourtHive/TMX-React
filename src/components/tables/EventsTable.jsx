import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from 'components/tables/styles';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Grid, IconButton, InputAdornment, Typography } from '@material-ui/core/';
import { getActionPanelBounds } from 'services/dynamicStyles/actionPanelBounds';
import CheckboxCell from 'components/tables/common/CheckboxCell';

import CloseIcon from '@material-ui/icons/Close';
import AddBoxIcon from '@material-ui/icons/AddBox';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import DoneIcon from '@material-ui/icons/AssignmentTurnedInTwoTone';

import TMXIconButton from 'components/buttons/TMXIconButton';
import TMXInput from 'components/inputs/TMXInput';

import NoticePaper from 'components/papers/notice/NoticePaper';
import { AddEventButton } from 'components/buttons/addEvent';

import { getEntries, getStatusGroup } from 'functions/events';
import EndlessTable from 'components/tables/EndlessTable';
import { filterTableRows, getColumnMenuItems } from 'components/tables/utils';
import { eventRoute } from 'components/tournament/tabRoute';

export function EventsTable(props) {
  const { events } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const actionBoundsRef = useRef(null);

  const editState = useSelector((state) => state.tmx.editState);
  const selectedTournamentId = useSelector((state) => state.tmx.selectedTournamentId);
  const hiddenColumns = useSelector((state) => state.tmx.hiddenColumns.events) || [];

  const [filterValue, setFilterValue] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [actionPanelStyle, setActionPanelStyle] = useState[{}];

  const approvedCount = (rowData) => {
    const entries = getEntries(rowData);
    return entries.participantIds.length || 0;
  };
  const registrationStatus = (rowData) => {
    const confirmed = getStatusGroup({ selectedEvent: rowData });
    return (confirmed && confirmed.length) || 0;
  };

  const renderInOut = (rowData) => {
    const values = {
      i: t('indoors'),
      o: t('outdoors')
    };
    return values[rowData.indoorOutdoor] || '';
  };
  const renderSurface = (rowData) => {
    const values = {
      C: t('surfaces.clay'),
      H: t('surfaces.hard'),
      G: t('surfaces.grass'),
      R: t('surfaces.carpet')
    };
    return values[rowData.surfaceCategory] || '';
  };

  function eventName(event) {
    if (event.eventName) return event.eventName;
    if (event.name) return event.name;
    const eventName = [event.category?.categoryName, event.gender, event.eventType].filter((f) => f).join(' ');
    return eventName;
  }

  const checkedEventIds = (tableData?.filter((event) => event.checked) || []).map((p) => p.eventId);

  const data = events.map((event, index) => {
    const checked = checkedEventIds.includes(event.eventId);
    return {
      checked,
      rank: event.rank,
      index: index + 1,
      id: event.eventId,
      eventId: event.eventId,
      name: eventName(event),
      participants: approvedCount(event),
      confirmed: registrationStatus(event),
      indoorOutdoor: renderInOut(event),
      surfaceCategory: renderSurface(event),
      scheduledMatches: event.scheduledMatches,
      completed: event.completed,
      draws: event?.drawDefinitions?.length,
      drawsCount: event?.drawDefinitions?.length
    };
  });

  const triggerActionPanelStyle = () => {
    const { style: actionStyle } = getActionPanelBounds(actionBoundsRef);
    const style = actionStyle;
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

  const uncheckAllRows = () => {
    const updatedTableData = tableData.map((row) => ({ ...row, checked: false }));
    setTableData(updatedTableData);
  };

  const addEvent = () => {
    dispatch({ type: 'visible drawer', payload: 'event' });
  };
  const handleRowClick = (_, rowItem) => {
    if (editMode) return;
    dispatch({ type: 'select event', payload: rowItem.eventId });
    const nextRoute = eventRoute({ tournamentId: selectedTournamentId, eventId: rowItem.id });
    history.push(nextRoute);
  };

  const deleteAction = (eventIds) => {
    function doIt() {
      setEditMode(false); // after delete exit edit mode
      dispatch({
        type: 'tournamentEngine',
        payload: {
          methods: [
            {
              method: 'deleteEvents',
              params: { eventIds }
            }
          ]
        }
      });
    }

    dispatch({
      type: 'alert dialog',
      payload: {
        title: `${t('delete')} ${t('Event(s)')}`,
        content: `${t('delete')} ${t('Selected Event(s)')}?`,
        cancel: true,
        okTitle: t('delete'),
        ok: doIt
      }
    });
  };

  const deleteEventAction = () => {
    const checkedEvents = tableData.filter((row) => row.checked);
    const eventIds = checkedEvents.map((e) => e.eventId);
    deleteAction(eventIds);
    uncheckAllRows();
  };

  const exitSelectionMode = () => {
    const updatedFilteredData = filteredData.map((row) => ({ ...row, checked: false }));
    const updatedTableData = data.map((row) => ({ ...row, checked: false }));
    setFilteredData(updatedFilteredData);
    setTableData(updatedTableData);
    setEditMode(false);
  };

  const ActionPanelMenu = () => {
    const checkedEvents = tableData.filter((row) => row.checked).length;
    const selectedCount = `${checkedEvents} ${t('Selected')}`;
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
                onClick={deleteEventAction}
                className={classes.iconMargin}
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

  const renderCheckboxColumnTitle = () => ({
    node: <CheckboxCell onChange={handleTitleCheckboxToggle} row={0} />,
    className: classes.TableIndexCell
  });
  const renderCheckboxValue = (row) => ({
    node: <CheckboxCell onChange={handleCheckBoxToggle} row={row} />,
    className: classes.TableIndexCell
  });

  const editModeAction = () => setEditMode(!editMode);
  const isHidden = (name) => hiddenColumns.includes(name);

  const columns = [
    {
      key: 'checkbox',
      getTitle: renderCheckboxColumnTitle,
      getValue: renderCheckboxValue,
      hidden: () => !editMode
    },
    {
      key: 'name',
      getTitle: () => ({ node: t('nm'), className: classes.eventNameColumn }),
      getValue: (row) => ({ node: row.name })
    },
    {
      key: 'rank',
      getTitle: () => ({ node: t('rnk'), className: classes.countColumn }),
      getValue: (row) => ({ node: row.provider }),
      hidden: () => isHidden('rank')
    },
    {
      key: 'participants',
      getTitle: () => ({ node: t('pyr'), className: classes.countColumn }),
      getValue: (row) => ({ node: row.participants }),
      hidden: () => isHidden('participants')
    },
    {
      key: 'confirmed',
      getTitle: () => ({ node: t('Confirmed'), className: classes.countColumn }),
      getValue: (row) => ({ node: row.confirmed }),
      hidden: () => isHidden('confirmed')
    },
    {
      key: 'indoorOutdoor',
      getTitle: () => ({ node: t('indoorOutdoor'), className: classes.countColumn }),
      getValue: (row) => ({ node: row.indoorOutdoor }),
      hidden: () => isHidden('indoorOutdoor')
    },
    {
      key: 'surfaceCategory',
      getTitle: () => ({ node: t('events.surfaceCategory'), className: classes.countColumn }),
      getValue: (row) => ({ node: row.surfaceCategory }),
      hidden: () => isHidden('surfaceCategory')
    },
    {
      key: 'scheduledMatches',
      getTitle: () => ({ node: t('draws.scheduled'), className: classes.countColumn }),
      getValue: (row) => ({ node: row.scheduledMatches }),
      hidden: () => isHidden('scheduledMatches')
    },
    {
      key: 'completed',
      getTitle: () => ({ node: t('draws.completed'), className: classes.countColumn }),
      getValue: (row) => ({ node: row.completed }),
      hidden: () => isHidden('completed')
    },
    {
      key: 'draws',
      getTitle: () => ({ node: t('drz'), className: classes.countColumn }),
      getValue: (row) => ({ node: row.draws }),
      hidden: () => isHidden('draws')
    }
  ];

  const visibleColumns = columns.filter((column) => (column.hidden ? !column.hidden() : true));

  const setColumnHiddenState = ({ key }) => {
    dispatch({
      type: 'hide column',
      payload: { table: 'events', field: key, hidden: !isHidden(key) }
    });
  };
  const columnMenuItems = getColumnMenuItems(columns, setColumnHiddenState).filter(
    (menuItem) => !['checkbox', 'index', 'name'].includes(menuItem.id)
  );

  const NotEditingButtonGroup = () => {
    return (
      <>
        <TMXIconButton
          className={classes.iconMargin}
          id="viewColumns"
          title={t('Show Columns')}
          menuItems={columnMenuItems}
          icon={<ViewColumnIcon />}
        />
        {!editState ? null : (
          <TMXIconButton
            title={t('add')}
            id="addEvent"
            onClick={addEvent}
            className={classes.iconMargin}
            icon={<AddBoxIcon />}
          />
        )}
        {!editState ? null : (
          <TMXIconButton
            id="editMode"
            // className={classes.iconMargin}
            onClick={editModeAction}
            title={t('More')}
            icon={<MoreVertIcon />}
          />
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

  const handleOnChangeFilter = (event) => {
    const targetValue = event?.target?.value;
    setFilterValue(targetValue);
    setFilteredData(filterTableRows(data, visibleColumns, targetValue));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const firstEvent = filteredData[0];
      if (firstEvent) {
        dispatch({ type: 'select event', payload: firstEvent.eventId });
        const nextRoute = eventRoute({ tournamentId: selectedTournamentId, eventId: firstEvent.eventId });
        history.push(nextRoute);
      }
    }
  };

  const dataForTable = filterValue ? filteredData : data;

  const cellConfig = { className: classes.EPCellConfig };
  const getRowSize = () => 48;
  const isDraggableRow = () => false;
  const rowConfig = {
    draggableRow: isDraggableRow,
    rowSize: getRowSize
  };
  const tableConfig = {
    className: classes.EPTableConfig
  };

  const rowIsChecked = !!data.find((row) => row.checked);

  const showFilterCount = filterValue.length || data.length !== events.length;
  const filteredCount = `${t('Showing')} ${dataForTable.length} ${t('of')} ${events.length} ${t('evt')}`;
  const eventsCount = showFilterCount ? filteredCount : '';

  if (!dataForTable.length && !filterValue) {
    return (
      <NoticePaper className={'info'} style={{ marginTop: '1em' }}>
        <Grid container spacing={2} direction="row" justify="flex-start">
          <Grid item>Prompt to add events</Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Grid container direction="row" justify="flex-end">
              <AddEventButton />
            </Grid>
          </Grid>
        </Grid>
      </NoticePaper>
    );
  }

  return (
    <>
      <div style={{ marginBottom: '1em' }} />
      {!rowIsChecked ? null : (
        <div style={actionPanelStyle}>
          <ActionPanelMenu />
        </div>
      )}
      <Grid
        ref={actionBoundsRef}
        className="tableHeader"
        container
        direction="row"
        alignItems="stretch"
        style={{ width: '100%' }}
      >
        <Grid item style={{ flexGrow: 1 }}>
          <Grid alignItems="center" container direction="row" justify="flex-start">
            <TMXInput
              className={classes.inputMargin}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton>
                    {' '}
                    <SearchIcon />{' '}
                  </IconButton>
                </InputAdornment>
              }
              onChange={handleOnChangeFilter}
              onKeyDown={handleKeyPress}
            />
          </Grid>
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <Grid alignItems="center" container direction="row" justify="flex-end">
            {editMode ? <EditingButtonGroup /> : <NotEditingButtonGroup />}
          </Grid>
        </Grid>
      </Grid>
      <Typography variant="h1" className={classes.tablePaperTitle}>
        {eventsCount}
      </Typography>
      <div style={{ marginBottom: '1em' }} />
      <EndlessTable
        data={dataForTable}
        id={'eventsTable'}
        columns={visibleColumns}
        onRowClick={handleRowClick}
        rowConfig={rowConfig}
        cellConfig={cellConfig}
        tableConfig={tableConfig}
      />
    </>
  );
}
