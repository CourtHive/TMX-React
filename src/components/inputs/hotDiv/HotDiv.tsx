import React, { useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import {
  PROMPT,
  MOVEDOWN,
  MOVEUP,
  HOTKEYS,
  MODIFIERS,
  SIDE1KEYS,
  SIDE2KEYS
} from 'functions/scoring/scoreEntry/constants';
import { useStyles } from 'components/inputs/hotDiv/styles';
import { calcScore } from 'functions/scoring/scoreEntry/scoreCalcs';

interface HotDivProps {
  currentRow?: number;
  matchUpFormat?: string;
  onClick: (row?: number) => void;
  row: number;
  rowsLength: number;
  setValues: (values: any[]) => void;
  values: any[];
}

const HotDiv: React.FC<HotDivProps> = ({ currentRow, matchUpFormat, onClick, row, rowsLength, setValues, values }) => {
  const classes = useStyles();
  const hotDivRef = useRef<HTMLDivElement>(null);

  useHotkeys(
    HOTKEYS,
    (event, handler) => {
      event.preventDefault();
      handleHotKey(row, handler.key, rowsLength - 1);
    },
    [currentRow, matchUpFormat, values]
  );
  useEffect(() => {
    if (hotDivRef && row === currentRow) {
      const bounding = hotDivRef.current.getBoundingClientRect();
      if (bounding.bottom > (window.innerHeight || document.documentElement.clientHeight) || bounding.top < 0) {
        hotDivRef.current.scrollIntoView();
      }
    }
  }, [currentRow, row]);

  const handleClick = () => onClick(row);

  const updateMatchUp = (matchUp) => {
    if (matchUp.winningSide) {
      console.log({ matchUp });
    }
    const newValues = values.map((v, r) => {
      if (r !== row) {
        return v;
      }
      return Object.assign(v, matchUp);
    });
    setValues(newValues);
  };

  const handleHotKey = (row, enteredValue, numberOfRows) => {
    if (row !== currentRow) return;
    const shifted = enteredValue.indexOf('shift+') === 0;
    const lowSide = SIDE1KEYS.includes(enteredValue) ? 1 : SIDE2KEYS.includes(enteredValue) ? 2 : undefined;
    const value = shifted ? enteredValue.slice(6) : enteredValue;

    if (lowSide || MODIFIERS.includes(value)) {
      const { updated, matchUp: updatedMatchUp } = calcScore({
        lowSide,
        value,
        matchUp: values[row],
        matchUpFormat,
        shiftFirst: true,
        checkFormat: true
      });

      if (updated) {
        updateMatchUp(updatedMatchUp);
      }
    }
    if (MOVEDOWN.includes(enteredValue)) {
      let nextRowValue = currentRow + 1;
      if (nextRowValue > numberOfRows) {
        nextRowValue = 0;
      }
      onClick(nextRowValue);
    } else if (MOVEUP.includes(enteredValue)) {
      let nextRowValue = currentRow - 1;
      if (nextRowValue < 0) {
        nextRowValue = numberOfRows;
      }
      onClick(nextRowValue);
    }
  };

  return (
    <div className={row === currentRow ? classes.currentRow : classes.scoreEntry} onClick={handleClick} ref={hotDivRef}>
      {values[row]?.score || PROMPT}
    </div>
  );
};

export default HotDiv;
