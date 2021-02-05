import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import CancelButton from 'components/buttons/cancel/CancelButton';
import { useMediaQuery } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';

import { useStyleStatusDialog } from 'components/dialogs/scoringObjectDialog/styles';
import {
  MatchParticipantStatus,
  MatchParticipantStatusCategory,
  ScoringMatchUpInterface,
  StatusIconProps,
  StatusIconSideEnum
} from 'components/dialogs/scoringObjectDialog/typedefs/scoringTypes';
import CustomDialog from 'components/dialogs/CustomDialog';
import ScoringDialogTitle from 'components/dialogs/scoringObjectDialog/ScoringDialogTitle';
import ScoringDialogActions from 'components/dialogs/scoringObjectDialog/ScoringDialogActions';
import ScoringDialogContent from 'components/dialogs/scoringObjectDialog/ScoringDialogContent';
import { defaultChangeCategory } from 'components/dialogs/scoringObjectDialog/utils';
import { Winner } from 'components/dialogs/scoringObjectDialog/constants';
import TMXStandardButton from 'components/buttons/standard/TMXStandardButton';

interface StatusDialogProps {
  isOpen: boolean;
  isSide1: boolean;
  status: MatchParticipantStatus;
  setTo: number;
  categories: MatchParticipantStatusCategory[];
  matchUp: ScoringMatchUpInterface;
  StatusDisplayFactory: React.FC<StatusIconProps>;
  setMatchUp: (matchUp: ScoringMatchUpInterface) => void;
  openDialog: () => void;
  closeDialog: () => void;
  applyStatus: () => void;
  changeStatusCategory?: (event: React.ChangeEvent<{ name?: string; value: unknown }>, isSide1: boolean) => void;
}

const StatusDialog: React.FC<StatusDialogProps> = ({
  isOpen,
  isSide1,
  status,
  setTo,
  categories,
  matchUp,
  StatusDisplayFactory,
  setMatchUp,
  openDialog,
  closeDialog,
  applyStatus,
  changeStatusCategory
}) => {
  const classes = useStyleStatusDialog();
  const { t } = useTranslation();
  const theme = useTheme();

  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const side: StatusIconSideEnum = isSide1 ? StatusIconSideEnum.side1 : StatusIconSideEnum.side2;
  const isStatusDialogDisabled =
    matchUp.status.side1?.categoryName === Winner.categoryName ||
    matchUp.status.side2?.categoryName === Winner.categoryName;

  const handleChangeCategory = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    changeStatusCategory
      ? changeStatusCategory(event, isSide1)
      : defaultChangeCategory(event, isSide1, matchUp, setTo, categories, setMatchUp);
  };
  const handleChangeSubCategory = (event) => {
    const categoryWithSubcategories = categories.filter((category) =>
      category.subCategories.find((subCategory) => subCategory.matchUpStatusCodeDisplay === event.target.value)
    );
    const subCategory = categoryWithSubcategories.map((category) =>
      category.subCategories.find((subCategory) => subCategory.matchUpStatusCodeDisplay === event.target.value)
    );
    const status: MatchParticipantStatus = {
      categoryName: categoryWithSubcategories[0].label,
      subCategoryName: subCategory[0].label,
      matchUpStatusCodeDisplay: subCategory[0].matchUpStatusCodeDisplay,
      matchUpStatusCode: subCategory[0].matchUpStatusCode
    };
    setMatchUp({
      ...matchUp,
      status: {
        side1: isSide1 ? status : matchUp.status.side1,
        side2: !isSide1 ? status : matchUp.status.side2
      }
    });
  };

  const filteredCategories = categories
    .filter((category) => !category.hidden)
    .map((category) => (
      <MenuItem id={category.label} key={category.label} value={category.label}>
        {category.label}
      </MenuItem>
    ));

  const selectedCategory =
    categories.find((category) => category.label === status?.categoryName && !category.hidden) || categories[0];
  const selectedSubCategory =
    selectedCategory.subCategories.find(
      (subCategory) =>
        subCategory.matchUpStatusCodeDisplay === status?.matchUpStatusCodeDisplay && !selectedCategory.hidden
    ) || selectedCategory.subCategories[0];

  const filteredSubcategories = selectedCategory.subCategories.map((subCategory, index) => (
    <MenuItem key={`${subCategory.matchUpStatusCodeDisplay}${index}`} value={subCategory.matchUpStatusCodeDisplay}>
      {subCategory.description}
    </MenuItem>
  ));

  const statusDialogTitle = (
    <ScoringDialogTitle id="status-dialog-title">
      <Typography variant="h6">Match Status</Typography>
    </ScoringDialogTitle>
  );

  const statusDialogContent = (
    <ScoringDialogContent>
      <div className={classes.contentWrapper}>
        <Select
          id="status-category-selector"
          className={classes.selector}
          autoWidth={true}
          fullWidth={true}
          value={selectedCategory.label}
          variant="outlined"
          onChange={handleChangeCategory}
          MenuProps={{
            id: 'status-category-selector-menu'
          }}
        >
          {filteredCategories}
        </Select>
        <Select
          id="status-sub-category-selector"
          className={classes.selector}
          autoWidth={true}
          fullWidth={true}
          value={selectedSubCategory.matchUpStatusCodeDisplay}
          variant="outlined"
          onChange={handleChangeSubCategory}
        >
          {filteredSubcategories}
        </Select>
      </div>
    </ScoringDialogContent>
  );

  const statusDialogActions = (
    <ScoringDialogActions>
      <Grid container direction="row-reverse" spacing={2} className={classes.actionsWrapper}>
        <Grid item xs={12} sm="auto">
          {/* TODO: create button wrappers with their own styles */}
          <TMXStandardButton onClick={applyStatus}>Apply</TMXStandardButton>
        </Grid>
        <Grid item xs={12} sm="auto">
          <CancelButton id="status-dialog-close" onClick={closeDialog} variant={matches ? 'text' : 'outlined'}>
            {t('Close')}
          </CancelButton>
        </Grid>
      </Grid>
    </ScoringDialogActions>
  );

  return (
    <>
      <StatusDisplayFactory
        displayAsIcon={true}
        disabled={isStatusDialogDisabled}
        side={side}
        status={status}
        onClick={openDialog}
      />
      <CustomDialog open={isOpen} handleOnClose={closeDialog}>
        <div className={matches ? classes.root : classes.rootXS}>
          {statusDialogTitle}
          {statusDialogContent}
          {statusDialogActions}
        </div>
      </CustomDialog>
    </>
  );
};

export default StatusDialog;
