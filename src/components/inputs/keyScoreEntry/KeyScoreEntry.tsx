import React, { useEffect, useState, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { useStyles } from 'components/inputs/keyScoreEntry/styles';
import { scoreGovernor } from 'tods-competition-factory';
const { keyValueScore, keyValueConstants } = scoreGovernor;
const { HOTKEYS, MODIFIERS, MOVEDOWN, MOVEUP, PROMPT, SIDE1KEYS, SIDE2KEYS } = keyValueConstants;

interface KeyScoreEntryProps {
  currentMatchUpId?: string;
  matchUpFormat: string;
  rowChange: (increment?: number, matchUpId?: string) => void;
  tableDataWithFilters?: any[];
  rowSizes?: any[];
  data: any;
  setRowSizes: (rowSizes: number[]) => void;
  updateData: (data: any) => void;
}

const KeyScoreEntry: React.FC<KeyScoreEntryProps> = ({
  data,
  currentMatchUpId,
  matchUpFormat,
  rowChange,
  tableDataWithFilters,
  rowSizes,
  setRowSizes,
  updateData
}) => {
  const classes = useStyles();
  const hotDivRef = useRef<HTMLDivElement>(null);
  const hotDivRefWrapper = useRef<HTMLDivElement>(null);
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    if (hotDivRef && data.matchUpId === currentMatchUpId) {
      const bounding = hotDivRef.current.getBoundingClientRect();
      if (bounding.bottom > (window.innerHeight || document.documentElement.clientHeight) || bounding.top < 0) {
        hotDivRef.current.scrollIntoView();
      }
      const height = hotDivRefWrapper?.current?.getBoundingClientRect()?.height;
      const newRowSizes = tableDataWithFilters?.map((row) => {
        return row.matchUpId === currentMatchUpId ? height : rowSizes[row.index];
      });
      if (JSON.stringify(rowSizes) !== JSON.stringify(newRowSizes)) {
        setRowSizes(newRowSizes);
      }
    }
  }, [currentMatchUpId, tableDataWithFilters, setRowSizes, rowSizes, localData.score, data.matchUpId]);

  const handleClick = () => {
    rowChange(0, data.matchUpId);
  };

  const handleHotKey = (enteredValue) => {
    if (data.matchUpId !== currentMatchUpId) return;
    const shifted = enteredValue.indexOf('shift+') === 0;
    const lowSide = SIDE1KEYS.includes(enteredValue) ? 1 : SIDE2KEYS.includes(enteredValue) ? 2 : undefined;
    const value = shifted ? enteredValue.slice(6) : enteredValue;
    if (lowSide || MODIFIERS.includes(value)) {
      const { matchUpStatus, score, sets, winningSide } = localData;

      const {
        updated,
        sets: updatedSets,
        score: updatedScore,
        winningSide: updatedWinningSide,
        matchUpStatus: updatedMatchUpStatus
      } = keyValueScore({
        value,
        lowSide,

        sets,
        score,
        winningSide,
        matchUpStatus,
        matchUpFormat,
        shiftFirst: true
      });

      if (updated) {
        const updatedData = Object.assign({}, localData, {
          updated,
          sets: updatedSets,
          score: updatedScore,
          winningSide: updatedWinningSide,
          matchUpStatus: updatedMatchUpStatus
        });
        setLocalData(updatedData);
        updateData(updatedData);
      }
    }

    if (MOVEDOWN.includes(enteredValue)) {
      rowChange(1, data.matchUpId);
    } else if (MOVEUP.includes(enteredValue)) {
      rowChange(-1, data.matchUpId);
    }
  };

  useHotkeys(
    HOTKEYS,
    (event, handler) => {
      event.preventDefault();
      handleHotKey(handler.key);
    },
    [currentMatchUpId, matchUpFormat, localData.score]
  );

  return (
    <div ref={hotDivRefWrapper}>
      <div
        className={data.matchUpId === currentMatchUpId ? classes.currentRow : classes.scoreEntry}
        onClick={handleClick}
        ref={hotDivRef}
      >
        {localData.score || PROMPT}
      </div>
    </div>
  );
};

export default KeyScoreEntry;
