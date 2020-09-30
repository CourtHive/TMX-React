import React, { CSSProperties, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import RankingIcon from '@material-ui/icons/FormatListNumbered';
import DoneIcon from '@material-ui/icons/AssignmentTurnedInTwoTone';

import { Grid, IconButton, InputAdornment, Tooltip, Typography } from '@material-ui/core/';

import { useStyles } from 'components/tables/styles';
import { EditParticipantRanking } from 'components/forms/EditNumber/EditParticipantRanking';
import { EditParticipantRating } from 'components/forms/EditNumber/EditParticipantRating';
import TMXInput from 'components/inputs/TMXInput';
import TMXIconButton from 'components/buttons/TMXIconButton';
import EndlessTable from 'components/tables/EndlessTable';
import { getEntries } from 'functions/events';
import CheckboxCell from 'components/tables/common/CheckboxCell';
import { TableConfigInterface } from 'components/tables/EndlessTable/typedefs';
import { filterTableRows, getColumnMenuItems } from 'components/tables/utils';

import { tournamentEngine, participantConstants } from 'tods-competition-factory';
const { RANKING, RATING } = participantConstants;

export function DrawParticipants(props) {
  const { selectedEvent, selectedDraw } = props;
  const { eventType } = selectedEvent;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const editState = useSelector((state: any) => state.tmx.editState);
  const hiddenColumns = useSelector((state: any) => state.tmx.hiddenColumns.eventParticipants) || [];
  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);

  const [editMode, setEditMode] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterValue, setFilterValue] = useState<string>('');

  const editParticipants = !editState ? false : editMode;
  const enteredInDraw = (selectedDraw && getEntries(selectedDraw).participantIds) || [];
  const enteredIds = enteredInDraw || [];

  tournamentEngine.setState(tournamentRecord);
  const participants = tournamentRecord.participants || [];
  const participantFilter = (participant) => (enteredIds || []).indexOf(participant.participantId) >= 0;
  const filteredEventParticipants = (participants || []).filter(participantFilter);
  const findParticipant = ({ participantId }) =>
    participants.find((participant) => participant.participantId === participantId);

  const category = selectedEvent?.category?.categoryName;
  const classes = useStyles();

  const [actions, setActions] = useState(null);
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

  const participantScaleValue = ({ participant, scaleType }) => {
    if (!selectedEvent) return undefined;
    const scaleAttributes = { scaleType, scaleName: category, eventType };
    const { scaleItem } = tournamentEngine.participantScaleItem({ participant, scaleAttributes });
    return scaleItem && scaleItem.scaleValue;
  };

  const checkedParticipantIds = (tableData?.filter((participant) => participant.checked) || []).map(
    (p) => p.participantId
  );

  const data = filteredEventParticipants
    .map((participant) => {
      const { participantId, person } = participant;
      const sex = (person?.sex || '')[0];
      const signedIn = tournamentEngine.getParticipantSignInStatus(participant);
      let className = sex === 'M' ? classes.male : sex === 'F' ? classes.female : null;
      if (!signedIn) className += ` ${classes.notSignedIn}`;
      const checked = checkedParticipantIds.includes(participantId);

      return {
        checked,
        name: participant.name,
        ranking: participantScaleValue({ participant, scaleType: RANKING }),
        rating: participantScaleValue({ participant, scaleType: RATING }),
        firstName: person?.standardGivenName,
        lastName: person?.standardFamilyName,
        ioc: person?.nationalityCode,
        sex: person?.sex,
        id: participantId,
        className,
        signedIn
      };
    })
    .sort((a, b) => (editMode ? 0 : (a.ranking || 9999) - (b.ranking || 9999)))
    .map((participant, i) => ({ ...participant, index: i + 1 }));

  const cellConfig = {
    className: classes.EPCellConfig
  };
  const getRowSize = () => 48;
  const isDraggableRow = () => false;
  const rowConfig = {
    draggableRow: isDraggableRow,
    rowSize: getRowSize
  };
  const tableConfig: TableConfigInterface = {
    className: classes.EPTableConfig,
    tableHeight: window.innerHeight - 300
  };

  const validColumns = {
    TEAM: ['ranking'],
    DOUBLES: ['ranking', 'rating'],
    SINGLES: ['firstName', 'lastName', 'ranking', 'rating', 'ioc', 'sex']
  };
  const isHidden = (name) => {
    const isValid = validColumns[eventType]?.includes(name);
    return !isValid || hiddenColumns.includes(name);
  };

  const getActionBounds = () => {
    const boundingClient = ref?.current?.getBoundingClientRect();
    const parentBoundingClient = ref?.current?.parentElement.getBoundingClientRect();
    const top = (boundingClient?.top || 0) - (parentBoundingClient.top || 0) - 5 + window.scrollY;
    const actionAttrs = {
      elementDimensions: {
        top,
        height: boundingClient?.height,
        width: boundingClient?.width
      }
    };
    setActions(actionAttrs);
  };

  const uncheckAllRows = () => {
    const updatedTableData = tableData.map((row) => ({ ...row, checked: false }));
    setTableData(updatedTableData);
  };

  const handleTitleCheckboxToggle = (event) => {
    const dataToDisplay = filterValue ? filteredData : data;
    const updatedTableData = dataToDisplay.map((row) => ({
      ...row,
      checked: event.target.checked
    }));
    setTableData(updatedTableData);
    setFilteredData(updatedTableData);
    getActionBounds();
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
    getActionBounds();
  };

  const renderCheckboxColumnTitle = () => {
    const dataToDisplay = filterValue ? filteredData : data;
    const row = {
      checked: !dataToDisplay.find((row) => !row.checked)
    };
    return {
      node: <CheckboxCell onChange={handleTitleCheckboxToggle} row={row} />,
      className: classes.TableIndexCell
    };
  };
  const renderIndexColumnTitle = () => ({
    node: '#',
    className: `${classes.headerCells} ${classes.TableIndexCell}`
  });
  const renderNameColumnTitle = () => ({ node: 'Name', className: `${classes.headerCells} ${classes.EPFullNameCell}` });
  const renderFirstNameColumnTitle = () => ({ node: 'First Name', className: classes.headerCells });
  const renderLastNameColumnTitle = () => ({ node: 'Last Name', className: classes.headerCells });
  const renderRankingColumnTitle = () => ({
    node: 'Ranking',
    className: `${classes.headerCells} ${classes.EPScaleCell}`
  });
  const renderRatingColumnTitle = () => ({
    node: 'Rating',
    className: `${classes.headerCells} ${classes.EPScaleCell}`
  });
  const renderGenderColumnTitle = () => ({
    node: 'Gender',
    className: `${classes.headerCells} ${classes.EPGenderCell}`
  });
  const renderCheckboxValue = (row) => ({
    node: <CheckboxCell onChange={handleCheckBoxToggle} row={row} />,
    className: classes.TableIndexCell
  });
  const renderIndexValue = (row) => ({ node: row.index, className: classes.TableIndexCell });
  const renderNameValue = (row) => ({ node: row.name });
  const renderFirstNameValue = (row) => ({ node: row.firstName });
  const renderLastNameValue = (row) => ({ node: row.lastName });
  const renderEditRankingInput = (row) => ({
    node: editParticipants ? (
      <EditParticipantRanking
        key="ranking"
        participantId={row.id}
        ranking={row.ranking}
        onChange={handleUpdateRanking}
      />
    ) : (
      row.ranking
    )
  });
  const renderEditRatingInput = (row) => ({
    node: editParticipants ? (
      <EditParticipantRating key="rating" participantId={row.id} rating={row.rating} onChange={handleUpdateRating} />
    ) : (
      row.rating
    )
  });
  const renderGenderValue = (row) => ({ node: row.sex });

  /*
  // TODO: add entry details column
  let qualifiers = (selectedDraw && Array.isArray(selectedDraw.qualifiers) && selectedDraw.qualifiers) || [];
  let wildcards = (selectedDraw && Array.isArray(selectedDraw.wildcards) && selectedDraw.wildcards) || [];
  let luckylosers = (selectedDraw && Array.isArray(selectedDraw.luckylosers) && selectedDraw.luckylosers) || [];
  let qualified = [].concat(...qualifiers.map(q => [].concat(...q.map(p=>p.participantId)) ));
  let accepted = [].concat(...((selectedDraw && selectedDraw.approved) || []));
  const entryDetails = rowData => {
      if (!rowData) { return { label: '', color: '' }; }
      if (wildcards.indexOf(rowData.participantId) >= 0) return { label: 'WC', color: '' };
      if (luckylosers.indexOf(rowData.participantId) >= 0) return { label: 'LL', color: '' };
      if (qualified.indexOf(rowData.participantId) >= 0) return { label: t('Qualified'), color: '' };
      if (accepted.indexOf(rowData.participantId) >= 0) return { label: t('Accepted'), color: '' };
      return { label: '', color: '' };
  };
  const rowStyle = rowData => {
      let color = rowData.sex === 'M' ? 'blue' : rowData.sex === 'F' ? 'rgb(132, 0, 118)' : '';
      let opacity = rowData.signedIn ? 1 : .5;
      let backgroundColor = selectedDraw ? entryDetails(rowData).color : '';
      return { color, opacity, backgroundColor };
  };
  */

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
      getTitle: renderNameColumnTitle,
      getValue: renderNameValue
    },
    {
      key: 'firstName',
      getTitle: renderFirstNameColumnTitle,
      getValue: renderFirstNameValue,
      hidden: () => isHidden('firstName')
    },
    {
      key: 'lastName',
      getTitle: renderLastNameColumnTitle,
      getValue: renderLastNameValue,
      hidden: () => isHidden('lastName')
    },
    {
      key: 'ranking',
      getTitle: renderRankingColumnTitle,
      getValue: renderEditRankingInput,
      hidden: () => !category || isHidden('ranking')
    },
    {
      key: 'rating',
      getTitle: renderRatingColumnTitle,
      getValue: renderEditRatingInput,
      hidden: () => !category || isHidden('rating')
    },
    {
      key: 'sex',
      getTitle: renderGenderColumnTitle,
      getValue: renderGenderValue,
      hidden: () => isHidden('sex')
    }
  ];

  const visibleColumns = columns.filter((column) => (column.hidden ? !column.hidden() : true));
  const setColumnHiddenState = ({ key }) => {
    dispatch({
      type: 'hide column',
      payload: { table: 'eventParticipants', field: key, hidden: !isHidden(key) }
    });
  };

  let skipColumns = ['checkbox', 'index', 'name'];
  if (!category) skipColumns = skipColumns.concat('ranking', 'rating');
  const columnMenuItems = getColumnMenuItems(columns, setColumnHiddenState).filter(
    (menuItem) => !skipColumns.includes(menuItem.id)
  );
  //  const participantType = eventType === 'TEAM' ? t('Teams') : eventType === 'DOUBLES' ? t('Pairs') : t('Competitors');
  //  const participantCount = `${participantType} (${data.length})`;
  const addParticipants = () => {
    dispatch({ type: 'visible drawer', payload: 'addEventParticipants' });
    setEditMode(false);
  };

  const handleUpdateRanking = (result) => {
    const { participantId, value } = result;
    const sourceData = (tableData.length && tableData) || data;
    const updatedTableData = sourceData.map((row) => ({
      ...row,
      ranking: row.id === participantId ? value : row.ranking
    }));
    const mappedDataToFilter = filteredData.map((filteredItem) => {
      return data.find((item) => item.id === filteredItem.id);
    });

    console.log({ updatedTableData });
    setFilteredData(mappedDataToFilter);
    setTableData(updatedTableData);
  };
  const handleUpdateRating = (result) => {
    const { participantId, value } = result;
    const sourceData = (tableData.length && tableData) || data;
    const updatedTableData = sourceData.map((row) => ({
      ...row,
      rating: row.id === participantId ? value : row.rating
    }));
    const mappedDataToFilter = filteredData.map((filteredItem) => {
      return data.find((item) => item.id === filteredItem.id);
    });

    setFilteredData(mappedDataToFilter);
    setTableData(updatedTableData);
  };

  const scaleItemsWithParticipantIDsArray = tableData
    .map((row) => {
      const scaleItems = [];
      const participantId = row.id;
      const participant = findParticipant({ participantId });
      const existingRanking = participantScaleValue({ participant, scaleType: RANKING });
      const existingRating = participantScaleValue({ participant, scaleType: RATING });
      if (!participant) return undefined;
      if (row.ranking !== existingRanking) {
        scaleItems.push({
          scaleType: RANKING,
          scaleName: category,
          scaleValue: row.ranking,
          eventType
        });
      }
      if (row.rating !== existingRating) {
        scaleItems.push({
          scaleType: RATING,
          scaleName: category,
          scaleValue: row.rating,
          eventType
        });
      }
      if (scaleItems.length) {
        return { participantId, scaleItems };
      }
      return undefined;
    })
    .filter((f) => f);

  const editModeAction = () => {
    if (editMode && scaleItemsWithParticipantIDsArray.length) {
      console.log({ scaleItemsWithParticipantIDsArray });
      // only update participant scale items if existing edit mode
      dispatch({
        type: 'tournamentEngine',
        payload: {
          methods: [{ method: 'setParticipantScaleItems', params: { scaleItemsWithParticipantIDsArray } }]
        }
      });
    }
    setEditMode(!editMode);
  };

  const rankByRatings = () => {
    // why do participantIds need to be passed into this function?
    // should it be all participants in a category, not just event participants?
    const participantIds = filteredEventParticipants.map((p) => p.participantId);
    setEditMode(false);

    const methods = [];
    if (scaleItemsWithParticipantIDsArray.length) {
      methods.push({ method: 'setParticipantScaleItems', params: { scaleItemsWithParticipantIDsArray } });
    }
    methods.push({ method: 'rankByRatings', params: { participantIds, category, eventType } });
    dispatch({
      type: 'tournamentEngine',
      payload: { methods }
    });
  };

  const handleClickSearch = (event) => {
    console.log(event);
  };
  const handleOnChangeFilter = (event) => {
    const targetValue = event?.target?.value;
    setFilterValue(targetValue);
    setFilteredData(filterTableRows(data, visibleColumns, targetValue));
  };

  const dataForTable = filterValue.length > 0 ? filteredData : data;
  const rowIsChecked = !!tableData.find((row) => row.checked);

  const deleteSelectedParticipants = () => {
    const checkedRows = tableData.filter((row) => row.checked);
    const participantIds = checkedRows.map((row) => row.id);
    if (filterValue) {
      const updatedFilteredData = filteredData.filter((row) => !participantIds.includes(row.id));
      setFilteredData(updatedFilteredData);
    }
    uncheckAllRows();
    setEditMode(false);
    console.log('implement delete draw participants', { participantIds });
    // dispatch({type: 'draw participants delete', payload: {participants, selectedDraw} })
  };

  const ActionPanelMenu = () => {
    const checkedRows = tableData.filter((row) => row.checked).length;
    const selectedCount = `${checkedRows} ${t('Selected')}`;
    return (
      <>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Typography variant="h1" className={classes.itemsCount}>
              {selectedCount}
            </Typography>
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Grid container alignItems="center" direction="row" justify="flex-end">
              <TMXIconButton
                id="deleteSelected"
                title={t('remove')}
                className={classes.iconMargin}
                onClick={deleteSelectedParticipants}
                icon={<DeleteIcon />}
              />
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  };
  const NotEditingButtonGroup = () => {
    return (
      <>
        <TMXIconButton
          // className={editState && classes.iconMargin}
          id="viewColumns"
          title={t('Show Columns')}
          menuItems={columnMenuItems}
          icon={<ViewColumnIcon />}
        />
        {!editState ? null : (
          <TMXIconButton
            title={t('add')}
            id="addEventParticipants"
            onClick={addParticipants}
            // className={classes.iconMargin}
            icon={<GroupAddIcon />}
          />
        )}
        {!editState ? null : (
          <TMXIconButton id="editMode" onClick={editModeAction} title={t('More')} icon={<MoreVertIcon />} />
        )}
      </>
    );
  };
  const EditingButtonGroup = () => {
    return (
      <>
        {!category ? null : (
          <TMXIconButton
            id="rankByRatings"
            title={t('phrases.rankbyrating')}
            onClick={rankByRatings}
            // className={classes.iconMargin}
            icon={<RankingIcon />}
          />
        )}
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

  return (
    <>
      <>
        {!rowIsChecked ? null : (
          <div style={actionPanelStyle}>
            <ActionPanelMenu />
          </div>
        )}
        <div style={{ marginBottom: '1em' }} />
        <Grid ref={ref} container direction="row" justify="space-between">
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
            <Grid alignItems="center" container direction="row" justify="flex-end">
              <Grid item>{editMode ? <EditingButtonGroup /> : <NotEditingButtonGroup />}</Grid>
              <Grid item />
            </Grid>
          </Grid>
        </Grid>
        <EndlessTable
          cellConfig={cellConfig}
          columns={visibleColumns}
          data={dataForTable}
          id={'eParticipantsTable'}
          rowConfig={rowConfig}
          tableConfig={tableConfig}
        />
      </>
    </>
  );
}
