import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import useTheme from '@material-ui/core/styles/useTheme';

import SearchIcon from '@material-ui/icons/Search';
import { getEntries } from 'functions/events';

import { Grid, IconButton, InputAdornment, Tooltip, Typography } from '@material-ui/core/';

import StandardPaper from 'components/papers/standard/StandardPaper';
import NoticePaper from 'components/papers/notice/NoticePaper';

import { useStyles } from 'components/tables/styles';

import TMXInput from 'components/inputs/TMXInput';
import TMXButton from 'components/buttons/TMXButton';
import EndlessTable from 'components/tables/EndlessTable';
import CheckboxCell from 'components/tables/common/CheckboxCell';
import { filterTableRows } from 'components/tables/utils';

import {
  tournamentEngine,
  eventConstants,
  drawDefinitionConstants,
  participantConstants,
  participantRoles
} from 'tods-competition-factory';

const { DOUBLES, SINGLES, TEAM } = eventConstants;
const { MAIN, PAIR } = drawDefinitionConstants;
const { ALTERNATE } = participantConstants;
const { COMPETITOR } = participantRoles;

export function AvailableParticipants(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { callback, tournamentRecord, selectedEvent, selectedDraw } = props;

  const selectedDrawId = selectedDraw?.drawId;

  const [tableData, setTableData] = useState([]);
  const [filterValue, setFilterValue] = useState();
  const [filteredData, setFilteredData] = useState([]);

  const tournamentParticipants = tournamentRecord?.participants || [];
  const { eventType } = selectedEvent || {};

  const drawDefinition = selectedDraw;

  const enteredInEvent = (selectedEvent && getEntries(selectedEvent).participantIds) || [];
  const enteredInDraw =
    (drawDefinition && drawDefinition.entries && drawDefinition.entries.map((entry) => entry.participantId)) || [];

  const participantCompetitors = tournamentParticipants.filter((participant) => {
    return !participant.participantRole || participant.participantRole === COMPETITOR;
  });

  // TODO: better gender matching function
  const eventGender = (selectedEvent && selectedEvent.gender && selectedEvent.gender[0]) || 'X';

  const participantFilter = (participant) => {
    const person = participant && participant.person;
    if (eventType === SINGLES && !person) return false;
    if (eventType === TEAM && participant.participantType !== TEAM) {
      return false;
    }
    if (eventType === DOUBLES && participant.participantType !== PAIR) return false;

    if (participant.participantStatus === 'WITHDRAWN') return false;
    if (!selectedDrawId && enteredInEvent.includes(participant.participantId)) {
      return false;
    }
    if (selectedDrawId && !enteredInEvent.includes(participant.participantId)) {
      return false;
    }
    if (selectedDrawId && enteredInDraw.includes(participant.participantId)) {
      return false;
    }

    const sex = person && person.sex && person.sex[0];
    if (eventType !== TEAM && eventGender !== 'X' && eventGender !== sex) {
      return false;
    }
    return true;
  };

  const checkedParticipantIds = (tableData?.filter((participant) => participant.checked) || []).map(
    (p) => p.participantId
  );

  const data = (participantCompetitors || [])
    .filter((participant) => participantFilter(participant))
    .map((participant) => {
      const { participantId, person } = participant;
      const checked = checkedParticipantIds.includes(participantId);
      const signedIn = !participant.person || tournamentEngine.getParticipantSignInStatus(participant);

      return {
        checked,
        id: participantId,
        participantId,
        name: participant.participantName,
        otherName: person && participant.person.otherName,
        sex: ((person && person.sex) || '')[0],
        signedIn
      };
    })
    .map((participant, i) => ({ ...participant, index: i + 1 }));

  const handleTitleCheckboxToggle = (event) => {
    const updatedTableData = data.map((row) => ({
      ...row,
      checked: event.target.checked
    }));
    setTableData(updatedTableData);
  };

  const handleCheckBoxToggle = (event, checked, row) => {
    const tableDataItem = data[row.index - 1];
    tableDataItem.checked = !tableDataItem.checked;
    const newTableData = [...data];
    newTableData[row.index - 1] = tableDataItem;
    const mappedDataToFilter = filteredData.map((filteredItem) => {
      return data.find((item) => item.id === filteredItem.id);
    });

    setFilteredData(mappedDataToFilter);
    setTableData(newTableData);
  };

  const renderCheckboxColumnTitle = () => ({
    node: <CheckboxCell onChange={handleTitleCheckboxToggle} row={0} />,
    className: classes.TableIndexCell
  });
  const renderIndexColumnTitle = () => ({
    node: '#',
    className: `${classes.headerCells} ${classes.TableIndexCell}`
  });
  const renderCheckboxValue = (row) => ({
    node: <CheckboxCell onChange={handleCheckBoxToggle} row={row} />,
    className: classes.TableIndexCell
  });
  const renderIndexValue = (row) => ({ node: row.index, className: classes.TableIndexCell });

  const columns = [
    {
      key: 'checkbox',
      getTitle: renderCheckboxColumnTitle,
      getValue: renderCheckboxValue
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
    }
  ];

  const addSelected = () => {
    const checkedRows = tableData.filter((row) => row.checked);
    const participantIds = checkedRows.map((row) => row.id);
    if (selectedDrawId) {
      dispatch({
        type: 'tournamentEngine',
        payload: {
          methods: [
            {
              method: 'addDrawEntries',
              params: {
                participantIds,
                drawId: selectedDrawId,
                entryStatus: ALTERNATE,
                entryStage: MAIN
              }
            }
          ]
        }
      });
    } else {
      const selectedEventId = selectedEvent.eventId;
      dispatch({
        type: 'tournamentEngine',
        payload: {
          methods: [
            {
              method: 'addEventEntries',
              params: {
                participantIds,
                eventId: selectedEventId,
                entryStatus: undefined,
                entryStage: undefined
              }
            }
          ]
        }
      });
    }
    if (callback && typeof callback === 'function') callback();
  };
  const EditingButtonGroup = () => {
    return (
      <>
        <TMXButton title={t('add')} id="addEventParticipants" onClick={addSelected} />
      </>
    );
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
    className: classes.availableParticipants,
    tableHeight: window.innerHeight
  };

  const handleClickSearch = (event) => {
    console.log(event);
  };
  const handleOnChangeFilter = (event) => {
    const targetValue = event?.target?.value;
    setFilterValue(targetValue);

    const newFilteredData = filterTableRows(data, [{ key: 'name' }], targetValue);
    setFilteredData(newFilteredData);
  };

  const rowIsChecked = !!tableData.find((row) => row.checked);
  const filteredRowIds = filteredData.map((row) => row.id);
  const dataForTable = data.filter((row) => !filterValue || filteredRowIds.includes(row.id));

  const showFilterCount = filterValue || data.length !== dataForTable.length;
  const filteredCount = `${t('Showing')} ${dataForTable.length} ${t('of')} ${data.length} ${t('Competitors')}`;
  const competitorsCount = showFilterCount ? filteredCount : '';

  if (!data.length) {
    return (
      <div style={{ padding: theme.spacing(3) }}>
        <Typography variant="h1" className={classes.tablePaperTitle}>
          {t('Available Competitors')}
        </Typography>
        <NoticePaper className={'info'} style={{ marginTop: '1em' }}>
          <Grid container spacing={2} direction="row" justify="flex-start">
            <Grid item>No Eligible Participants who are not already in event</Grid>
          </Grid>
        </NoticePaper>
      </div>
    );
  }

  return (
    <>
      <StandardPaper>
        <Typography variant="h1" className={classes.tablePaperTitle}>
          {t('Available Competitors')}
        </Typography>
        <div style={{ marginBottom: '1em' }} />
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Grid container spacing={2} direction="row" justify="flex-start">
              <Grid item xs={12} sm="auto">
                <TMXInput
                  endAdornment={
                    <InputAdornment position="end">
                      <Tooltip title={'Search'} aria-label={'Search'}>
                        <IconButton onClick={handleClickSearch} edge="end">
                          <SearchIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  }
                  onChange={handleOnChangeFilter}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row" spacing={2}>
              <Grid item>{rowIsChecked ? <EditingButtonGroup /> : null}</Grid>
              <Grid item />
            </Grid>
          </Grid>
        </Grid>
        <div style={{ marginBottom: '.5em' }} />
        <Typography variant="h1" className={classes.tablePaperTitle}>
          {competitorsCount}
        </Typography>
        <div style={{ marginBottom: '1em' }} />
        <EndlessTable
          cellConfig={cellConfig}
          data={dataForTable}
          columns={columns}
          id={'availableParticipants'}
          rowConfig={rowConfig}
          tableConfig={tableConfig}
        />
      </StandardPaper>
    </>
  );
}
