import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { Chip } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import DoneIcon from '@material-ui/icons/AssignmentTurnedInTwoTone';
import TMXIconButton from 'components/buttons/TMXIconButton';
import TMXInput from 'components/inputs/TMXInput';

import { env } from 'config/defaults';
import { populateCalendar } from 'functions/calendar';

import { context } from 'services/context';
import { displayTournament } from 'functions/tournament/tournamentDisplay';

import { useStyles } from 'components/tables/styles';
import { Grid, IconButton, InputAdornment, Tooltip } from '@material-ui/core/';
import { filterTableRows } from 'components/tables/utils';
import TMXButton from 'components/buttons/TMXButton';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { calendarRecord } from 'data/mappings/calendarRecord';
import { useColumnToggle } from 'hooks/useColumnToggle';

export function TournamentsTable() {
  const {
    state: { calendar: hiddenColumns = [] },
    dispatch: columnDispatch
  } = useColumnToggle();

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();

  const [checkboxSelection, setCheckBoxSelection] = useState(false);
  const [calendarEntries, setCalendarEntries] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterValue, setFilterValue] = useState();
  const [gridApi, setGridApi] = useState(null);

  const dataForTable = filterValue ? filteredData : calendarEntries;

  const isHidden = (name) => hiddenColumns.includes(name);

  const toggleCheckboxes = () => setCheckBoxSelection(!checkboxSelection);
  const onGridReady = (params) => setGridApi(params.api);

  // INITIAL_DATA_LOAD__________________________________________________________
  useEffect(() => {
    if (calendarEntries.length === 0) populateCalendar();
  }, [calendarEntries.length]);

  // FILTER_TABLE_DATA__________________________________________________________
  const handleOnChangeFilter = (event) => {
    const targetValue = event?.target?.value;
    setFilterValue(targetValue);
    setFilteredData(filterTableRows(calendarEntries, undefined, targetValue));
  };

  // allow searching by any value across all columns and select tournament on ENTER
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const tournament = filteredData[0];
      if (tournament?.tournamentId) {
        const tournamentId = tournament.tournamentId;
        displayTournament({ tournamentId, history });
      }
    }
  };

  // LISTENERS_FOR_UPDATED_TOURNAMENTS__________________________________________
  useEffect(() => {
    function handleTournamentUpdate(data) {
      const tournamentId = data?.tournamentId || data?.unifiedTournamentId?.tournamentId;
      if (tournamentId) {
        const tournament = calendarEntries.reduce((p, c) => (c.tournamentId === tournamentId ? c : p), undefined);
        const calendarEntry = calendarRecord(tournament);
        if (tournament) {
          const tournamentIds = calendarEntries.map(({ tournamentId }) => tournamentId);
          const index = tournamentIds.indexOf(tournament.tournamentId);
          calendarEntries[index] = calendarEntry;
          setCalendarEntries(calendarEntries);
        } else {
          calendarEntries.push(calendarEntry);
          setCalendarEntries(calendarEntries);
        }
      }
    }

    function refreshTournaments(records) {
      const calendarEntries = (records || [])
        .filter((f) => f.tournamentId || f.unifiedTournamentId?.tournamentId)
        .map(calendarRecord)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

      const todaysDate = new Date();
      const todayOrAfterIndex = calendarEntries.findIndex((tournament) => new Date(tournament.startDate) >= todaysDate);

      if (gridApi) {
        const initialScrollOffset = todayOrAfterIndex;
        // first up, need to make sure the grid is actually showing 500 or more rows
        if (gridApi.getInfiniteRowCount() < initialScrollOffset + 1) {
          gridApi.setRowCount(initialScrollOffset + 1, false);
        }
        // next, we can jump to the row
        gridApi.ensureIndexVisible(initialScrollOffset);
      }
      setCalendarEntries(calendarEntries);
    }

    context.ee.addListener('updateTournament', handleTournamentUpdate);
    context.ee.addListener('refreshTournaments', refreshTournaments);

    return function cleanup() {
      context.ee.removeListener('updateTournament', handleTournamentUpdate);
      context.ee.removeListener('refreshTournaments', refreshTournaments);
    };
    // [] as second parameter insures useEffect runs once; cleanup still called on unmount
    // eslint-disable-next-line
  }, []);

  // _RENDERERS________________________________________________________________
  const actionsButtonRenderer = (params) => {
    function loadTournament(params) {
      const tournamentId = params?.data?.tournamentId;
      if (tournamentId && !checkboxSelection) {
        displayTournament({ tournamentId, history });
      }
    }

    return <TMXButton title={'Go'} id="go" onClick={() => loadTournament(params)} />;
  };
  const ColourCellRenderer = (params) => {
    return <span style={{ color: params.color }}>{params.value}</span>;
  };
  const ChipCategoriesRenderer = (params) => {
    const tournamentCategories = Array.isArray(params.data?.categories) ? params.data.categories : [];
    const rows = tournamentCategories
      .filter((f) => f)
      .map((c, i) => <Chip key={i} label={c} color="primary" style={{ marginRight: 5 }} />);
    return <div style={{ padding: '0px 10px' }}>{rows} </div>;
  };
  const frameworkComponents = {
    actionsButtonRenderer: actionsButtonRenderer,
    colourCellRenderer: ColourCellRenderer,
    chipCategoriesRenderer: ChipCategoriesRenderer
  };

  // _TABLE_SETUP______________________________________________________________
  const defaultColDef = {
    autoHeight: true,
    sortable: true,
    resizable: true,
    filter: true,
    lockVisible: true,
    floatingFilter: false
  };

  const pagination = false;

  const columnTypes = {
    // nonEditableColumn: { editable: false },
    dateColumn: {
      width: 120,
      resizable: false
    }
  };

  const columnDefs = [
    {
      headerName: 'Tournament Name',
      field: 'name',
      wrapText: true,
      minWidth: 200,
      initialFlex: 1,
      cellStyle: { paddingRight: '5px' },
      checkboxSelection: () => checkboxSelection,
      headerCheckboxSelection: () => checkboxSelection,
      headerCheckboxSelectionFilteredOnly: true
    },
    {
      field: 'provider',
      headerName: 'Provider',
      hide: isHidden('provider')
    },
    {
      field: 'startDate',
      type: 'dateColumn',
      headerName: 'Start Date',
      hide: isHidden('startDate'),
      cellRendererParams: { color: 'green' },
      cellRenderer: 'colourCellRenderer'
    },
    {
      field: 'endDate',
      type: 'dateColumn',
      headerName: 'End Date',
      hide: isHidden('endDate'),
      cellRendererParams: { color: 'red' },
      cellRenderer: 'colourCellRenderer'
    },
    {
      width: 150,
      field: 'categories',
      headerName: 'Categories',
      hide: isHidden('categories'),
      cellRenderer: 'chipCategoriesRenderer'
    },
    {
      width: 150,
      field: 'actions',
      headerName: '',
      sortable: false,
      suppressMenu: true,
      cellRenderer: 'actionsButtonRenderer'
    }
  ];

  // examples for later
  const onRowClicked = (rowData) => {
    if (!rowData) console.log('row Clicked', { rowData });
  };
  const onRowSelected = (rowData) => {
    if (!rowData) console.log('row selected', { rowData });
  };
  const isRowSelectable = (rowNode) => {
    return rowNode.data ? true : false;
    // return rowNode.data ? rowNode.data.name.toLowerCase().startsWith('new') : false;
  };

  // ACTION_BUTTON_ROW
  const setColumnHiddenState = ({ key }) => {
    columnDispatch({ table: 'calendar', columnName: key });
    setTimeout(() => gridApi.resetRowHeights(), 50);
  };
  const columnMenuItems = columnDefs
    .filter((col) => !['name', 'index', 'actions'].includes(col.field))
    .map((col) => ({
      id: col.field,
      key: col.field,
      text: col.headerName,
      checked: !isHidden(col.field),
      onClick: setColumnHiddenState
    }));

  const addTournament = () => dispatch({ type: 'visible drawer', payload: 'tournament' });
  const allowAdd = env?.calendar?.addTournaments;

  const ButtonGroup = () => {
    return (
      <>
        <TMXIconButton
          className={classes.iconMargin}
          id="viewColumns"
          title={t('Show Columns')}
          menuItems={columnMenuItems}
          icon={<ViewColumnIcon />}
        />
        {!allowAdd ? null : (
          <TMXIconButton
            title={t('tournaments.add')}
            id="addTournament"
            onClick={addTournament}
            className={classes.iconMargin}
            icon={<AddBoxIcon />}
          />
        )}
        {!allowAdd ? null : (
          <TMXIconButton
            id="checkboxSelection"
            className={classes.iconMargin}
            onClick={toggleCheckboxes}
            title={t('More')}
            icon={checkboxSelection ? <DoneIcon /> : <MoreVertIcon />}
          />
        )}
      </>
    );
  };

  return (
    <div className={classes.pageWrapper}>
      <Grid container direction="row" alignItems="stretch">
        <Grid item style={{ flexGrow: 1 }}>
          <TMXInput
            className={classes.inputMargin}
            endAdornment={
              <InputAdornment position="end">
                <Tooltip title={'Search'} aria-label={'Search'}>
                  <IconButton edge="end">
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            }
            onChange={handleOnChangeFilter}
            onKeyDown={handleKeyPress}
          />
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <Grid alignItems="center" container direction="row" justify="flex-end">
            <ButtonGroup />
          </Grid>
        </Grid>
      </Grid>

      <div className="ag-theme-material" style={{ width: '100%' }}>
        <AgGridReact
          pagination={pagination}
          rowData={dataForTable}
          columnDefs={columnDefs}
          columnTypes={columnTypes}
          defaultColDef={defaultColDef}
          rowSelection={'multiple'}
          onGridReady={onGridReady}
          suppressCellSelection={true}
          frameworkComponents={frameworkComponents}
          suppressRowClickSelection={true}
          isRowSelectable={isRowSelectable}
          onRowClicked={onRowClicked}
          onRowSelected={onRowSelected}
          domLayout={'autoHeight'}
        ></AgGridReact>
      </div>
    </div>
  );
}
