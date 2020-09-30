import React, { CSSProperties, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import CloseIcon from '@material-ui/icons/Close';
import AddBoxIcon from '@material-ui/icons/AddBox';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import TMXIconButton from 'components/buttons/TMXIconButton';

import { Drawer, Grid, Typography } from '@material-ui/core/';
import { getColumnMenuItems } from 'components/tables/utils';
import CheckboxCell from 'components/tables/common/CheckboxCell';

import EndlessTable from 'components/tables/EndlessTable';
import { CellConfigInterface, TableConfigInterface } from 'components/tables/EndlessTable/typedefs';
import { useStyles } from 'components/tables/styles';
import { useStyles as useIconStyles } from 'components/tables/actions/styles';
// import tournamentEngine from 'engines/tournamentEngine';
import NoticePaper from 'components/papers/notice/NoticePaper';
import { AddLocationButton } from 'components/buttons/addLocation';

import DeleteIcon from '@material-ui/icons/Delete';
import { getActionPanelBounds } from 'services/dynamicStyles/actionPanelBounds';
import { LocationAdd } from './locationAdd/locationAdd';

export const LocationsTable = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const iconClasses = useIconStyles();

  const { venues } = props;

  const tableRef = useRef<HTMLDivElement>(null);
  const actionBoundsRef = useRef(null);

  const editState = useSelector((state: any) => state.tmx.editState);
  const hiddenColumns = useSelector((state: any) => state.tmx.hiddenColumns.locations) || [];

  const [editMode, setEditMode] = useState(false);
  const [actionPanelStyle, setActionPanelStyle] = useState<CSSProperties>({});
  const [tableData, setTableData] = useState([]);

  const [locationData, setLocationData] = useState(undefined);

  const addNewLocation = (newLocation) => {
    console.log({ newLocation });
    setLocationData(undefined);
    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'addVenue',
            params: { venue: newLocation }
          }
        ]
      }
    });
  };

  const uncheckAllRows = () => {
    const updatedTableData = tableData.map((row) => ({ ...row, checked: false }));
    setTableData(updatedTableData);
  };

  const exitSelectionMode = () => {
    uncheckAllRows();
    setEditMode(false);
  };

  const deleteSelected = () => {
    const venueIds = (tableData?.filter((venue) => venue.checked) || []).map((p) => p.venueId);
    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'deleteVenues',
            params: { venueIds }
          }
        ]
      }
    });
    exitSelectionMode();
  };

  const editModeAction = () => setEditMode(!editMode);
  const isHidden = (name) => {
    return hiddenColumns.includes(name);
  };

  const cellConfig: CellConfigInterface = {
    className: classes.EPCellConfig
  };

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

  const ActionPanelMenu = () => {
    const checkedLocations = tableData.filter((row) => row.checked).length;
    const selectedCount = `${checkedLocations} ${t('Selected')}`;
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
                onClick={deleteSelected}
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

  const checkedVenueIds = (tableData?.filter((venue) => venue.checked) || []).map((p) => p.venueId);

  // const checkedCount = checkedVenueIds.length;
  // const allVenuesChecked = checkedCount > 0 && checkedCount === (tableData || []).length;

  const data = venues.map((venue, index) => {
    const { venueId } = venue;
    const courtsAvailable = (venue.courts || []).length;
    const checked = checkedVenueIds.includes(venueId);
    return {
      checked,
      venueId,
      id: venueId,
      index: index + 1,
      name: venue.venueName,
      abbr: venue.venueAbbreviation,
      availableCourts: courtsAvailable
    };
  });

  const handleTitleCheckboxToggle = (event) => {
    const toggleRow = () => event.target.checked;
    const newTableData = data.map((row) => ({ ...row, checked: toggleRow() }));
    setTableData(newTableData);
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

    setTableData(newTableData);
    triggerActionPanelStyle();
  };

  const renderCheckboxColumnTitle = () => {
    return {
      node: <CheckboxCell onChange={handleTitleCheckboxToggle} row={0} />,
      className: classes.TableIndexCell
    };
  };
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
      key: 'name',
      getTitle: () => ({
        node: t('nm'),
        className: classes.headerCells
      }),
      getValue: (row) => ({ node: row.name })
    },
    {
      key: 'abbr',
      getTitle: () => ({
        node: t('Abbreviation'),
        className: classes.headerCells
      }),
      getValue: (row) => ({ node: row.abbr }),
      hidden: () => isHidden('abbr')
    },
    {
      key: 'availableCourts',
      getTitle: () => ({
        node: t('Available courts'),
        className: classes.headerCells
      }),
      getValue: (row) => ({ node: row.availableCourts }),
      hidden: () => isHidden('availableCourts')
    }
  ];

  const getRowSize = () => 48;
  const isDraggableRow = () => false;
  const rowConfig = {
    draggableRow: isDraggableRow,
    rowSize: getRowSize
  };
  const tableConfig: TableConfigInterface = {
    className: classes.EPTableConfig,
    tableHeight: window.innerHeight - 330
  };

  const visibleColumns = columns.filter((column) => (column.hidden ? !column.hidden() : true));
  const setColumnHiddenState = ({ key }) => {
    dispatch({
      type: 'hide column',
      payload: { table: 'locations', field: key, hidden: !isHidden(key) }
    });
  };

  const columnMenuItems = getColumnMenuItems(columns, setColumnHiddenState).filter(
    (menuItem) => !['checkbox', 'index', 'name'].includes(menuItem.id)
  );

  const addLocation = () => {
    setLocationData({});
  };

  const ButtonGroup = () => {
    return (
      <>
        <TMXIconButton
          id="viewColumns"
          title={t('Show Columns')}
          menuItems={columnMenuItems}
          className={iconClasses.iconMargin}
          icon={<ViewColumnIcon />}
        />
        {!editState ? null : (
          <TMXIconButton
            title={t('add')}
            id="addLocation"
            onClick={addLocation}
            className={iconClasses.iconMargin}
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

  const rowIsChecked = !!tableData.find((row) => row.checked);

  const handleOnRowClick = (_, rowData) => {
    if (editMode) return;
    dispatch({ type: 'select venue', payload: { venueId: rowData.venueId } });
  };

  if (!data.length) {
    return (
      <>
        <Drawer id="locationForm" anchor={'right'} open={Boolean(locationData)} onClose={() => setLocationData(false)}>
          <LocationAdd addLocation={addNewLocation} />
        </Drawer>
        <NoticePaper className={'info'} style={{ marginTop: '1em' }}>
          <Grid container spacing={2} direction="row" justify="flex-start">
            <Grid item>Prompt to add location</Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <Grid container direction="row" justify="flex-end">
                <AddLocationButton onClick={addLocation} />
              </Grid>
            </Grid>
          </Grid>
        </NoticePaper>
      </>
    );
  }

  return (
    <>
      {!rowIsChecked || !editMode ? null : (
        <div style={actionPanelStyle}>
          <ActionPanelMenu />
        </div>
      )}
      <div style={{ marginBottom: '1em' }} />
      <Grid ref={actionBoundsRef} container direction="row" justify="space-between">
        <Grid item>
          <Grid container spacing={2} direction="row" justify="flex-start"></Grid>
        </Grid>
        <Grid item>
          <Grid alignItems="center" container direction="row" justify="flex-end">
            <Grid item>
              <ButtonGroup />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <div ref={tableRef}>
        <EndlessTable
          cellConfig={cellConfig}
          columns={visibleColumns}
          data={data}
          id={'locationsable'}
          onRowClick={handleOnRowClick}
          rowConfig={rowConfig}
          tableConfig={tableConfig}
        />
      </div>

      <Drawer id="locationForm" anchor={'right'} open={Boolean(locationData)} onClose={() => setLocationData(false)}>
        <LocationAdd addLocation={addNewLocation} />
      </Drawer>
    </>
  );
};

// <PersonForm {...personData} />
