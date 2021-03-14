import React, { useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { useStyles } from 'components/inputs/keyScoreEntry/styles';
import { scoreGovernor } from 'tods-competition-factory';
const { keyValueScore, keyValueConstants } = scoreGovernor;
const { HOTKEYS, MODIFIERS, MOVEDOWN, MOVEUP, PROMPT, SIDE1KEYS, SIDE2KEYS } = keyValueConstants;

const KeyScoreEntry = ({ data, currentMatchUpId, matchUpFormat, rowChange, updateData }) => {
  const classes = useStyles();
  const hotDivRef = useRef(null);
  const hotDivRefWrapper = useRef(null);

  const handleRowChange = (index, matchUpId) => {
    if (typeof rowChange === 'function') rowChange(index, matchUpId);
  };

  const handleClick = () => {
    handleRowChange(0, data.matchUpId);
  };

  const handleHotKey = (enteredValue) => {
    if (currentMatchUpId !== data.matchUpId) return;
    const shifted = enteredValue.indexOf('shift+') === 0;
    const lowSide = SIDE1KEYS.includes(enteredValue) ? 1 : SIDE2KEYS.includes(enteredValue) ? 2 : undefined;
    const value = shifted ? enteredValue.slice(6) : enteredValue;
    if (lowSide || MODIFIERS.includes(value)) {
      const { matchUpStatus, score, sets, winningSide } = data;

      const {
        updated,
        sets: updatedSets,
        scoreString: updatedScoreString,
        winningSide: updatedWinningSide,
        matchUpStatus: updatedMatchUpStatus
      } = keyValueScore({
        value,
        lowSide,

        sets,
        scoreString: score,
        winningSide,
        matchUpStatus,
        matchUpFormat,
        shiftFirst: true
      });

      if (updated) {
        const updatedData = Object.assign({}, data, {
          updated,
          sets: updatedSets,
          score: updatedScoreString,
          winningSide: updatedWinningSide,
          matchUpStatus: updatedMatchUpStatus
        });
        updateData(updatedData);
      }
    }

    if (MOVEDOWN.includes(enteredValue)) {
      handleRowChange(1, data.matchUpId);
    } else if (MOVEUP.includes(enteredValue)) {
      handleRowChange(-1, data.matchUpId);
    }
  };

  useHotkeys(
    HOTKEYS,
    (event, handler) => {
      event.preventDefault();
      handleHotKey(handler.key);
    },
    [currentMatchUpId, matchUpFormat, data.score]
  );

  return (
    <div ref={hotDivRefWrapper}>
      <div
        className={data.matchUpId === currentMatchUpId ? classes.currentRow : classes.scoreEntry}
        onClick={handleClick}
        ref={hotDivRef}
      >
        {data.score || PROMPT}
      </div>
    </div>
  );
};

export default KeyScoreEntry;
