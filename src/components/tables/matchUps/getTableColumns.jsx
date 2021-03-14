import React from 'react';

import Typography from '@material-ui/core/Typography';

import { reverseStringScore } from 'functions/scoring/reverseStringScore';

const renderScore = (rowData) => {
  if (!rowData.score) return '';
  return rowData.winningSide === 2 ? reverseStringScore(rowData.score) : rowData.score;
};

export const isHidden = (name, hiddenColumns) => hiddenColumns.indexOf(name) >= 0;
export const getScore = (classes, isInEditMode, rowItem, selectedRowIndex, getScoreComponent) => {
  // const renderScoreComponent = isInEditMode && (selectedRowIndex === rowItem.index || !selectedRowIndex);
  const renderScoreComponent = isInEditMode && (rowItem.readyToScore || rowItem.score);
  return renderScoreComponent
    ? {
        node: getScoreComponent(rowItem)
      }
    : {
        node: <Typography className={classes.tableFontStyle}>{renderScore(rowItem)}</Typography>
      };
};
export const getTableColumns = (classes, getScoreComponent, hiddenColumns, isInEditMode, selectedRowIndex, t) => {
  return [
    {
      key: 'roundName',
      getTitle: () => ({
        node: <Typography className={classes.headerFontStyle}>{t('rnd')}</Typography>,
        className: classes.headerMain
      }),
      getValue: (rowItem) => ({
        node: <Typography className={classes.tableFontStyle}>{rowItem.roundName}</Typography>
      }),
      hidden: () => isHidden('roundName', hiddenColumns)
    },
    {
      key: 'event',
      getTitle: () => ({
        node: <Typography className={classes.headerFontStyle}>{t('ent')}</Typography>,
        className: classes.headerMain
      }),
      getValue: (rowItem) => ({ node: <Typography className={classes.tableFontStyle}>{rowItem.event}</Typography> }),
      hidden: () => isHidden('event', hiddenColumns)
    },
    {
      key: 'format',
      getTitle: () => ({
        node: <Typography className={classes.headerFontStyle}>{t('fmt')}</Typography>,
        className: classes.headerMain
      }),
      getValue: (rowItem) => ({ node: <Typography className={classes.tableFontStyle}>{rowItem.format}</Typography> }),
      hidden: () => isHidden('format', hiddenColumns)
    },
    {
      key: 'date',
      getTitle: () => ({
        node: <Typography className={classes.headerFontStyle}>{t('dt')}</Typography>,
        className: classes.headerMain
      }),
      getValue: (rowItem) => ({ node: <Typography className={classes.tableFontStyle}>{rowItem.date}</Typography> }),
      hidden: () => isHidden('date', hiddenColumns)
    },
    {
      key: 'court',
      getTitle: () => ({
        node: <Typography className={classes.headerFontStyle}>{t('ct')}</Typography>,
        className: classes.headerMain
      }),
      getValue: (rowItem) => ({ node: <Typography className={classes.tableFontStyle}>{rowItem.court}</Typography> }),
      hidden: () => isHidden('court', hiddenColumns)
    },
    {
      key: 'umpire',
      getTitle: () => ({
        node: <Typography className={classes.headerFontStyle}>{t('ref')}</Typography>,
        className: classes.headerMain
      }),
      getValue: (rowItem) => ({ node: <Typography className={classes.tableFontStyle}>{rowItem.umpire}</Typography> }),
      hidden: () => isHidden('umpire', hiddenColumns)
    },
    {
      key: 'scheduleTime',
      // TODO: add translation
      getTitle: () => ({
        node: <Typography className={classes.headerFontStyle}>{t('Schedule Time')}</Typography>,
        className: classes.headerMain
      }),
      getValue: (rowItem) => ({
        node: <Typography className={classes.tableFontStyle}>{rowItem.scheduleTime}</Typography>
      }),
      hidden: () => isHidden('scheduleTime', hiddenColumns)
    },
    {
      key: 'startTime',
      getTitle: () => ({
        node: <Typography className={classes.headerFontStyle}>{t('draws.starttime')}</Typography>,
        className: classes.headerMain
      }),
      getValue: (rowItem) => ({
        node: <Typography className={classes.tableFontStyle}>{rowItem.startTime}</Typography>
      }),
      hidden: () => isHidden('startTime', hiddenColumns)
    },
    {
      key: 'endTime',
      getTitle: () => ({
        node: <Typography className={classes.headerFontStyle}>{t('draws.endtime')}</Typography>,
        className: classes.headerMain
      }),
      getValue: (rowItem) => ({ node: <Typography className={classes.tableFontStyle}>{rowItem.endTime}</Typography> }),
      hidden: () => isHidden('endTime', hiddenColumns)
    },
    {
      key: 'player1',
      getTitle: () => ({
        node: <Typography className={classes.headerFontStyle}>{t('Player 1')}</Typography>,
        className: classes.headerMain
      }),
      getValue: (rowItem) => ({ node: <Typography className={classes.tableFontStyle}>{rowItem.player1}</Typography> }),
      hidden: () => isHidden('player1', hiddenColumns)
    },
    {
      key: 'player2',
      getTitle: () => ({
        node: <Typography className={classes.headerFontStyle}>{t('Player 2')}</Typography>,
        className: classes.headerMain
      }),
      getValue: (rowItem) => ({ node: <Typography className={classes.tableFontStyle}>{rowItem.player2}</Typography> }),
      hidden: () => isHidden('player2', hiddenColumns)
    },
    {
      key: 'status',
      getTitle: () => ({
        node: <Typography className={classes.headerFontStyle}>{t('stt')}</Typography>,
        className: classes.headerMain
      }),
      getValue: (rowItem) => ({ node: <Typography className={classes.tableFontStyle}>{rowItem.status}</Typography> }),
      hidden: () => isHidden('status', hiddenColumns)
    },
    {
      key: 'score',
      getTitle: () => ({
        node: <Typography className={classes.headerFontStyle}>{t('scr')}</Typography>,
        className: classes.headerMain
      }),
      getValue: (rowItem) => {
        return getScore(classes, isInEditMode, rowItem, selectedRowIndex, getScoreComponent);
      },
      hidden: () => isHidden('score', hiddenColumns)
    }
  ];
};
