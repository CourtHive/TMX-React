import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import SearchIcon from '@material-ui/icons/Search';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import TMXIconButton from 'components/buttons/TMXIconButton';
import NoticePaper from 'components/papers/notice/NoticePaper';

import TMXInput from 'components/inputs/TMXInput';
import EndlessTable from 'components/tables/EndlessTable';

import {
  getFilteredMatchUpsTableData,
  MatchUpsTableDataInterface
} from 'components/tables/matchUps/getFilteredTableData';
import { MatchUpTabMenu } from 'components/menus/matchUpsTabMenu';
import { TeamSelector } from 'components/selectors/TeamSelector';
import { getTableColumns } from 'components/tables/matchUps/getTableColumns';
import { TableConfigInterface } from 'components/tables/EndlessTable/typedefs';
import { filterTableRows, getColumnMenuItems } from 'components/tables/utils';
import { TieMatchUpContainer } from 'containers/tieMatchUp/tieMatchUpContainer';
// import { saveMatchUpResults } from 'components/tables/matchUps/saveMatchUpResults';
import { useStyles } from 'components/tables/styles';
import { isDev } from 'functions/isDev';

// import { tournamentEngine, participantRoles, participantTypes } from 'competitionFactory';
import { tournamentEngine, participantRoles, participantTypes } from 'tods-competition-factory';
const { TEAM } = participantTypes;
const { COMPETITOR } = participantRoles;

// const dateSort = (a, b) => {
//   const dateA = (a.schedule && a.schedule.day && new Date(a.schedule.day).getTime()) || 0;
//   const dateB = (b.schedule && b.schedule.day && new Date(b.schedule.day).getTime()) || 0;
//   return dateA - dateB;
// };

// const participantFlag = (person) => {
//   if (!person) return '';
//   const flag = person.nationalityCode ? flagIOC(person.nationalityCode) : '';
//   return flag ? `${flag.trim()} ` : '';
// };

export const MatchUpsTable: React.FC = () => {
  const NONE = '-';
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const scoringTieMatchUp = useSelector((state: any) => state.tmx.scoringTieMatchUp);
  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const selectedTeamId = useSelector((state: any) => state.tmx.select.matchUps.team);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);
  const editState = useSelector((state: any) => state.tmx.editState);
  const hiddenColumns = useSelector((state: any) => state.tmx.hiddenColumns.matchUps) || [];
  const matchUps = tournamentEngine.devContext(isDev()).setState(tournamentRecord).allTournamentMatchUps().matchUps;

  const { matchUp: tieMatchUp } = scoringTieMatchUp || {};

  const tournamentParticipants = tournamentRecord.participants || [];
  const teamParticipants = tournamentParticipants.filter((participant) => {
    return (
      (participant.participantRole === COMPETITOR || !participant.participantRole) &&
      participant.participantType === TEAM
    );
  });

  const [isInEditMode /*setIsInEditMode*/] = useState(false);

  const [filteredData, setFilteredData] = useState([]);
  const [matchUpData, setMatchUpData] = useState(undefined);
  const [filterValue, setFilterValue] = useState<string>('');
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const selectedTeam =
    selectedTeamId !== NONE && teamParticipants.find((team) => team.participantId === selectedTeamId);
  const teamIds = selectedTeam?.individualParticipantIds || [];

  const selectedDraw = undefined; // was useSelector
  const filteredMatchUpsTableData: MatchUpsTableDataInterface[] = getFilteredMatchUpsTableData(
    classes,
    matchUps,
    selectedDraw,
    selectedRowIndex,
    teamIds
  );

  const hotDivEntry = (): ReactNode => <></>;

  const tableColumns = getTableColumns(classes, hotDivEntry, hiddenColumns, isInEditMode, selectedRowIndex, t);

  const isHidden = (name) => hiddenColumns.indexOf(name) >= 0;
  const visibleColumns = tableColumns.filter((column) => (column.hidden ? !column.hidden() : true));
  const matchUpsCount = `${t('mts')} (${filteredMatchUpsTableData.length})`;

  const handleOnRowClick = (event, rowData, rowIndex) => {
    if (!editState) return;
    if (rowIndex === selectedRowIndex) {
      setSelectedRowIndex(null);
    } else {
      setSelectedRowIndex(rowIndex);
    }
    const { matchUpId } = rowData || {};
    if (!matchUpId) return;

    const coords = {
      screen_x: event.clientX,
      screen_y: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY
    };

    const matchUp = matchUps.reduce((matchUp, candidate) => {
      return candidate.matchUpId === matchUpId ? candidate : matchUp;
    }, undefined);

    if (matchUp) {
      setMatchUpData({ matchUp, coords });
    }
  };
  const closeMenu = () => {
    setMatchUpData(undefined);
  };

  const handleOnChangeFilter = (event) => {
    const targetValue = event?.target?.value;
    setFilterValue(targetValue);
    setFilteredData(filterTableRows(filteredMatchUpsTableData, visibleColumns, targetValue));
  };
  /*
  const handleEditButtonClick = () => {
    setIsInEditMode(true);
  };
  const handleSaveButtonClick = () => {
    saveMatchUpResults({ matchUps: values });
    setIsInEditMode(false);
    setSelectedRowIndex(undefined);
  };
  */
  const setColumnHiddenState = ({ key }) => {
    dispatch({
      type: 'hide column',
      payload: { table: 'matchUps', field: key, hidden: !isHidden(key) }
    });
  };
  const columnMenuItems = getColumnMenuItems(tableColumns, setColumnHiddenState).filter(
    (menuItem) => !['checkbox', 'index', 'player1', 'player2'].includes(menuItem.id)
  );

  const tableConfig: TableConfigInterface = {
    className: classes.RTableConfig,
    tableHeight: window.innerHeight - 250
  };
  const dataForTable = filterValue.length > 0 ? filteredData : filteredMatchUpsTableData;

  if (!matchUps?.length) {
    return (
      <>
        <Typography variant="h1" className={classes.tablePaperTitle}>
          {matchUpsCount}
        </Typography>
        <NoticePaper className={'info'} style={{ marginTop: '1em' }}>
          <Grid container spacing={2} direction="row" justify="flex-start">
            <Grid item>No Matches Notice</Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <Grid container direction="row" justify="flex-end">
                No Matches
              </Grid>
            </Grid>
          </Grid>
        </NoticePaper>
      </>
    );
  }

  return (
    <>
      {tieMatchUp ? (
        <TieMatchUpContainer tieMatchUp={tieMatchUp} />
      ) : (
        <>
          <Typography variant="h1" className={classes.tablePaperTitle}>
            {matchUpsCount}
          </Typography>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Grid container spacing={2} direction="row" justify="flex-start">
                <Grid item xs={12} sm="auto">
                  <TMXInput
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
                  />
                </Grid>
                {teamParticipants?.length > 0 && (
                  <Grid item xs={12} sm="auto">
                    <TeamSelector />
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={2}>
                <Grid item></Grid>
                <Grid item>
                  <TMXIconButton
                    className={classes.iconMargin}
                    id="viewColumns"
                    title={t('Show Columns')}
                    menuItems={columnMenuItems}
                    icon={<ViewColumnIcon />}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {!matchUpData ? null : <MatchUpTabMenu closeMenu={closeMenu} matchUpData={matchUpData} />}
          <EndlessTable
            columns={visibleColumns}
            data={dataForTable}
            initialScrollOffset={0}
            onRowClick={handleOnRowClick}
            tableConfig={tableConfig}
          />
        </>
      )}
    </>
  );
};
