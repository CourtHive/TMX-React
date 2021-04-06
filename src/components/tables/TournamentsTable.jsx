import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { Chip } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import TMXIconButton from 'components/buttons/TMXIconButton';
import TMXInput from 'components/inputs/TMXInput';
import SyncIcon from '@material-ui/icons/Sync';

import { env } from 'config/defaults';
import { populateCalendar } from 'functions/calendar';

import { context } from 'services/context';
import { displayTournament } from 'functions/tournament/tournamentDisplay';
import { fetchCalendar } from 'services/communications/Axios/fetch/fetchCalendar';
import { updateCalendar } from 'services/storage/updateCalendar';
// import NoticePaper from 'components/papers/notice/NoticePaper';
// import { AddTournamentButton } from 'components/buttons/addTournament';

import { useStyles } from 'components/tables/styles';
import EndlessTable from 'components/tables/EndlessTable';
import { Grid, IconButton, InputAdornment, Tooltip } from '@material-ui/core/';
import { filterTableRows, getColumnMenuItems } from 'components/tables/utils';

import { utilities } from 'tods-competition-factory';
import { tabRoute } from 'components/tournament/tabRoute';
// import { TAB_EVENTS } from 'stores/tmx/types/tabs';

const { formatDate } = utilities.dateTime;

function trnyRecord(tournamentRecord) {
  const eventCategories = (tournamentRecord.events || [])
    .map((event) => event.category?.categoryName)
    .flat()
    .filter((f) => f);
  const categories = utilities.unique(eventCategories);

  const { endDate, startDate, tournamentName, unifiedTournamentId } = tournamentRecord || {};
  let { tournamentId } = unifiedTournamentId || {};
  const { organisation } = unifiedTournamentId || {};
  if (!tournamentId) tournamentId = tournamentRecord.tournamentId;
  const provider = organisation?.organisationAbbreviation || tournamentRecord.org?.abbr || '';

  return {
    categories,
    tournamentId,
    name: tournamentName,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    provider
  };
}

const rowHeight = 48;

export function TournamentsTable() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();

  const hiddenColumns = useSelector((state) => state.tmx.hiddenColumns.tournaments) || [];

  const defaultValues = {
    category: undefined,
    tournaments: [],
    selectedRow: null
  };
  const [values, setValues] = useState(defaultValues);
  const [initialScrollOffset, setInitialScrollOffset] = useState(0);

  const handleRowClick = (_, rowItem) => {
    displayTournament(rowItem);
    // const nextRoute = tabRoute({ tournamentId: rowItem.tournamentId, tabIndex: TAB_EVENTS });
    const nextRoute = tabRoute(...rowItem);
    history.push(nextRoute);
  };

  useEffect(() => {
    function handleTournamentUpdate(data) {
      const tournamentId = data?.tournamentId || data?.unifiedTournamentId?.tournamentId;
      if (tournamentId) {
        const tournaments = values.tournaments;
        const tournament = values.tournaments.reduce((p, c) => (c.tournamentId === tournamentId ? c : p), undefined);
        if (tournament) {
          const index = tournaments.indexOf(tournament);
          tournaments[index] = trnyRecord(data);
          setValues({ ...values, tournaments });
        } else {
          tournaments.push(trnyRecord(data));
          setValues({ ...values, tournaments });
        }
      }
    }

    function refreshTournaments(records) {
      const tournaments = (records || [])
        .filter((f) => f.tournamentId || f.unifiedTournamentId?.tournamentId)
        .map(trnyRecord)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

      const todaysDate = new Date();
      const todayOrAfterIndex = tournaments.findIndex((tournament) => new Date(tournament.startDate) >= todaysDate);
      const scrollOffset = todayOrAfterIndex > 1 ? todayOrAfterIndex * rowHeight : 0;
      setInitialScrollOffset(scrollOffset);
      setValues({ ...values, tournaments });
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

  useEffect(() => {
    if (values.tournaments.length === 0) {
      populateCalendar();
    }
  }, [values.tournaments.length]);

  const renderNameColumnTitle = () => ({ node: t('Tournament Name'), className: classes.headerCells });
  const renderProviderColumnTitle = () => ({ node: t('Provider'), className: classes.headerCells });
  const renderStartDateColumnTitle = () => ({ node: t('Start Date'), className: classes.headerCells });
  const renderEndDateColumnTitle = () => ({ node: t('End Date'), className: classes.headerCells });
  const renderCategoriesColumnTitle = () => ({ node: t('Categories'), className: classes.headerCells });
  const renderCategoriesValue = (row) => {
    const tournamentCategories = Array.isArray(row.categories) ? row.categories : [];
    const rows = tournamentCategories
      .filter((f) => f)
      .map((c, i) => <Chip key={i} label={c} color="primary" style={{ marginRight: 5 }} />);
    return {
      node: <div style={{ padding: '0px 10px' }}>{rows} </div>
    };
  };
  const renderIndexValue = (row) => ({
    node: row.index,
    className: `${classes.TableIndexCell} ${classes.boldContent}`
  });
  const renderIndexColumnTitle = () => ({
    node: '#',
    className: `${classes.headerCells} ${classes.TableIndexCell}`
  });
  const isHidden = (name) => hiddenColumns.includes(name);

  const columns = [
    {
      key: 'index',
      getTitle: renderIndexColumnTitle,
      getValue: renderIndexValue
    },
    {
      key: 'name',
      getTitle: renderNameColumnTitle,
      getValue: (row) => ({ node: row.name })
    },
    {
      key: 'provider',
      getTitle: renderProviderColumnTitle,
      getValue: (row) => ({ node: row.provider }),
      hidden: () => isHidden('provider')
    },
    {
      key: 'startDate',
      getTitle: renderStartDateColumnTitle,
      getValue: (row) => ({ node: row.startDate }),
      hidden: () => isHidden('startDate')
    },
    {
      key: 'endDate',
      getTitle: renderEndDateColumnTitle,
      getValue: (row) => ({ node: row.endDate }),
      hidden: () => isHidden('endDate')
    },
    {
      key: 'categories',
      getTitle: renderCategoriesColumnTitle,
      getValue: renderCategoriesValue,
      hidden: () => isHidden('categories')
    }
  ];

  const cellConfig = {
    className: classes.EPCellConfig
  };
  const getRowSize = () => rowHeight;
  const isDraggableRow = () => false;
  const rowConfig = {
    draggableRow: isDraggableRow,
    rowSize: getRowSize
  };
  const tableConfig = {
    className: classes.EPTableConfig,
    tableHeight: window.innerHeight - 200
  };

  const tableData = values.tournaments.map((tournament, i) => ({ ...tournament, index: i + 1 }));

  const [filterValue, setFilterValue] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const visibleColumns = columns.filter((column) => (column.hidden ? !column.hidden() : true));

  const setColumnHiddenState = ({ key }) => {
    dispatch({
      type: 'hide column',
      payload: { table: 'tournaments', field: key, hidden: !isHidden(key) }
    });
  };

  const columnMenuItems = getColumnMenuItems(columns, setColumnHiddenState).filter(
    (menuItem) => !['name', 'index'].includes(menuItem.id)
  );

  const syncCalendar = () => {
    dispatch({ type: 'loading state', payload: true });
    function success(tournaments) {
      if (tournaments) updateCalendar({ tournaments, merge: true });
    }
    function failure(data) {
      console.log('failure:', data);
    }
    fetchCalendar().then(success, failure);
  };

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
        <TMXIconButton
          className={classes.iconMargin}
          id="syncCalendar"
          title={t('requests.syncTournaments')}
          onClick={syncCalendar}
          icon={<SyncIcon />}
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
      </>
    );
  };

  const handleOnChangeFilter = (event) => {
    const targetValue = event?.target?.value;
    setFilterValue(targetValue);
    setFilteredData(filterTableRows(tableData, visibleColumns, targetValue));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const tournament = filteredData[0];
      if (tournament) displayTournament(tournament);
    }
  };

  const dataForTable = filterValue ? filteredData : tableData;

  /*
  if (!tableData.length) {
    return (
      <NoticePaper className={'info'} style={{marginTop: '1em'}}>
        <Grid container spacing={2} direction="row" justify="flex-start">
          <Grid item>
            <Grid container justify='flex-start'>
              Prompt to add tournaments
              <div className={classes.divider} />
              Load by ID
              <div className={classes.divider} />
              Import Record
              <div className={classes.divider} />
              Synchronize
            </Grid>
          </Grid>
          <Grid item style={{flexGrow: 1}}>
            <Grid container direction="row" justify='flex-end'>
              <AddTournamentButton onClick={addTournament} />
            </Grid>
          </Grid>
        </Grid>
      </NoticePaper>
    )
  }
  */

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

      <EndlessTable
        data={dataForTable}
        id={'tournamentsTable'}
        columns={visibleColumns}
        onRowClick={handleRowClick}
        rowConfig={rowConfig}
        cellConfig={cellConfig}
        tableConfig={tableConfig}
        initialScrollOffset={initialScrollOffset}
      />
    </div>
  );
}
