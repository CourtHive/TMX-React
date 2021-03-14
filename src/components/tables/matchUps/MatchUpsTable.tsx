import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';

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
import { useStyles } from 'components/tables/styles';
import { isDev } from 'functions/isDev';
import { PanelSelector } from 'components/selectors/PanelSelector';
import { TAB_MATCHUPS } from 'stores/tmx/types/tabs';
import { MatchOutcomeContainer } from 'containers/matchUpOutcome/MatchUpOutcomeContainer';

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
  const [matchUp, setMatchUp] = useState();
  const [targetMatchUp, setTargetMatchUp] = useState();
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
  const matchUpsCount = filteredMatchUpsTableData.length;

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
      setMatchUp(matchUp);
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
        <Grid container direction="row" justify="flex-start">
          <PanelSelector tournamentId={selectedTournamentId} contextId={TAB_MATCHUPS} />
          {matchUpsCount}
        </Grid>
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

  const closeMatchUpOutcome = () => {
    setMatchUp(undefined);
    setTargetMatchUp(undefined);
  };
  function scoreAction() {
    setTargetMatchUp(matchUp);
  }

  const menuActions = [
    { action: 'SCORE', id: 'scoreMatchUp', icon: null, click: scoreAction, text: 'Match Score' },
    { action: 'REFEREE', icon: null, click: closeMenu, text: 'Set Referee' },
    { action: 'SCHEDULE', icon: null, click: closeMenu, text: 'Set Schedule' },
    { action: 'PENALTY', icon: null, click: closeMenu, text: 'Assess Penalty' },
    { action: 'NICKNAME', icon: null, click: closeMenu, text: 'Assign Nickname' },
    { action: 'SUSPEND', icon: null, click: closeMenu, text: 'Suspend Match' },
    { action: 'START', icon: null, click: closeMenu, text: 'Set Match Start Time' },
    { action: 'END', icon: null, click: closeMenu, text: 'Set Match End Time' }
  ];

  return (
    <>
      {tieMatchUp ? (
        <TieMatchUpContainer tieMatchUp={tieMatchUp} />
      ) : (
        <>
          <Grid container item justify="flex-start">
            <PanelSelector tournamentId={selectedTournamentId} contextId={TAB_MATCHUPS} />
          </Grid>
          <NoticePaper className={'header'} style={{ marginTop: '1em' }}>
            <Grid container spacing={2} direction="row" justify="flex-start">
              <Grid item>{matchUpsCount}</Grid>
              <Grid item style={{ flexGrow: 1 }}>
                <Grid container direction="row" justify="flex-end">
                  Actions
                </Grid>
              </Grid>
            </Grid>
          </NoticePaper>
          <Grid container direction="row" justify="space-between" style={{ marginTop: '1em' }}>
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
          <EndlessTable
            columns={visibleColumns}
            data={dataForTable}
            initialScrollOffset={0}
            onRowClick={handleOnRowClick}
            tableConfig={tableConfig}
          />
          {matchUpData && <MatchUpTabMenu closeMenu={closeMenu} matchUpData={matchUpData} menuActions={menuActions} />}
          <MatchOutcomeContainer matchUp={targetMatchUp} closeDialog={closeMatchUpOutcome} />
        </>
      )}
    </>
  );
};
