import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useStyles } from 'components/tables/styles';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import DoneIcon from '@material-ui/icons/AssignmentTurnedInTwoTone';

import TMXIconButton from 'components/buttons/TMXIconButton';

import { getColumnMenuItems } from 'components/tables/utils';
import { Grid, Typography } from '@material-ui/core/';
import CheckboxCell from 'components/tables/common/CheckboxCell';
import { AddDrawButton } from 'components/buttons/addDraw';

import NoticePaper from 'components/papers/notice/NoticePaper';
import EndlessTable from 'components/tables/EndlessTable';

import { drawEngine } from 'tods-competition-factory';
import { drawRoute } from 'components/tournament/tabRoute';

export function EventDrawList(props) {
  const { selectedEvent } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();
  const ref = useRef(null);

  const editState = useSelector((state) => state.tmx.editState);
  const selectedTournamentId = useSelector((state) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state) => state.tmx.records[selectedTournamentId]);

  const participants = tournamentRecord.participants || [];

  const hiddenColumns = useSelector((state) => state.tmx.hiddenColumns.draws) || [];
  const playerCheckInState = Object.assign({}, ...participants.map((p) => ({ [p.id]: p.signedIn })));

  const [actions, setActions] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tableData, setTableData] = useState([]);

  const drawDefinitions = selectedEvent.drawDefinitions || [];

  const checkedIn = (rowData) => {
    const checkedIn = rowData.entries && rowData.entries.filter((entry) => playerCheckInState[entry.participantId]);
    return (checkedIn && checkedIn.length) || 0;
  };

  const editModeAction = () => setEditMode(!editMode);
  const isHidden = (name) => hiddenColumns.indexOf(name) >= 0;

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

  const checkedDrawIds = (tableData?.filter((draw) => draw.checked) || []).map((p) => p.drawId);

  const data = drawDefinitions
    .filter((f) => f)
    .map((drawDefinition) => {
      const { drawId, drawName } = drawDefinition;
      const checked = checkedDrawIds.includes(drawId);

      return {
        checked,
        id: drawId,
        drawId: drawId,
        name: drawName || drawDefinition.name,
        // seeds: draw.seeds,
        participants: drawDefinition?.entries?.length || 0,
        signedin: checkedIn(drawDefinition)
        // scheduled: draw.scheduled,
        // completed: draw.completed,
      };
    })
    .map((draw, i) => ({ ...draw, index: i + 1 }));

  useEffect(() => {
    const handleResize = () => {
      getActionBounds();
    };

    window.addEventListener('resize', handleResize, false);
    return () => window.removeEventListener('resize', handleResize, false);
  });

  const handleTitleCheckboxToggle = (event) => {
    const updatedTableData = data.map((row) => ({
      ...row,
      checked: event.target.checked
    }));
    setTableData(updatedTableData);
    getActionBounds();
  };
  const handleCheckBoxToggle = (event, checked, row) => {
    const tableDataItem = data[row.index - 1];
    tableDataItem.checked = !tableDataItem.checked;
    const newTableData = [...data];
    newTableData[row.index - 1] = tableDataItem;

    setTableData(newTableData);
    getActionBounds();
  };

  const uncheckAllRows = () => {
    const updatedTableData = tableData.map((row) => ({ ...row, checked: false }));
    setTableData(updatedTableData);
  };

  const actionPanelStyle = actions?.elementDimensions
    ? {
        zIndex: 1,
        position: 'absolute',
        backgroundColor: '#F5F5F5',
        borderRadius: '3px 3px 0 0',
        height: `${actions?.elementDimensions.height}px`,
        width: `${actions?.elementDimensions.width}px`
      }
    : undefined;

  const deleteDrawAction = () => {
    const checkedRows = tableData.filter((row) => row.checked);
    const drawIds = checkedRows.map((row) => row.id);
    const { eventId } = selectedEvent;
    uncheckAllRows();
    setEditMode(false);
    drawEngine.reset();

    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'deleteDrawDefinitions',
            params: { drawIds, eventId }
          }
        ]
      }
    });
  };

  const exitSelectionMode = () => {
    const updatedTableData = data.map((row) => ({ ...row, checked: false }));
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
                onClick={deleteDrawAction}
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
      key: 'title',
      getTitle: () => ({ node: t('nm'), className: classes.headerCells }),
      getValue: (row) => ({ node: row.name })
    },
    {
      key: 'participants',
      getTitle: () => ({ node: t('pyr'), className: classes.headerCells }),
      getValue: (row) => ({ node: row.participants }),
      hidden: () => isHidden('participants')
    },
    {
      key: 'signedin',
      getTitle: () => ({ node: t('signin.signedin'), className: classes.headerCells }),
      getValue: (row) => ({ node: row.signedin }),
      hidden: () => isHidden('signedin')
    }
  ];

  const visibleColumns = columns.filter((column) => (column.hidden ? !column.hidden() : true));
  const setColumnHiddenState = ({ key }) => {
    dispatch({
      type: 'hide column',
      payload: { table: 'draws', field: key, hidden: !isHidden(key) }
    });
  };

  const columnMenuItems = getColumnMenuItems(columns, setColumnHiddenState).filter(
    (menuItem) => !['checkbox', 'index', 'name'].includes(menuItem.id)
  );

  const addDrawAction = () => dispatch({ type: 'visible drawer', payload: 'draw' });

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
            id="addDraw"
            className={classes.iconMargin}
            onClick={addDrawAction}
            title={t('add')}
            icon={<AddBoxIcon />}
          />
        )}
        {!editState ? null : (
          <TMXIconButton
            id="editMode"
            className={classes.iconMargin}
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
    className: classes.EPTableConfig
  };

  const drawsCount = `${t('drz')} (${drawDefinitions.length})`;
  const rowIsChecked = !!data.find((row) => row.checked);

  const handleOnRowClick = (_, rowData) => {
    if (editMode) return;
    dispatch({ type: 'select event draw', payload: rowData.drawId });
    const { eventId } = selectedEvent;
    const nextRoute = drawRoute({ tournamentId: selectedTournamentId, eventId, drawId: rowData.drawId });
    history.push(nextRoute);
  };

  if (!data.length) {
    return (
      <NoticePaper className={'info'} style={{ marginTop: '1em' }}>
        <Grid container spacing={2} direction="row" justify="flex-start">
          <Grid item>Prompt to create draw</Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Grid container direction="row" justify="flex-end">
              <AddDrawButton onClick={addDrawAction} />
            </Grid>
          </Grid>
        </Grid>
      </NoticePaper>
    );
  }

  return (
    <>
      <div className={classes.divider} />
      <>
        {!rowIsChecked ? null : (
          <div style={actionPanelStyle}>
            <ActionPanelMenu />
          </div>
        )}
        <Grid
          ref={ref}
          className="tableHeader"
          container
          direction="row"
          alignItems="stretch"
          style={{ width: '100%' }}
        >
          <Grid item style={{ flexGrow: 1 }}>
            {drawsCount}
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Grid alignItems="center" container direction="row" justify="flex-end">
              {editMode ? <EditingButtonGroup /> : <NotEditingButtonGroup />}
            </Grid>
          </Grid>
        </Grid>
        <div style={{ marginBottom: '1em' }} />
        <EndlessTable
          cellConfig={cellConfig}
          columns={visibleColumns}
          data={data}
          id={'drawsListTable'}
          onRowClick={handleOnRowClick}
          rowConfig={rowConfig}
          tableConfig={tableConfig}
        />
      </>
    </>
  );
}
