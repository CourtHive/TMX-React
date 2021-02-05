import React, { useEffect } from 'react';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import useTheme from '@material-ui/core/styles/useTheme';
import Typography from '@material-ui/core/Typography';
import { useMediaQuery } from '@material-ui/core';

import {
  checkIfDecisionSet,
  findLeader,
  gameAutoCompleter,
  getSetScoreIfTiebreak,
  hasTiebreakWinner,
  hasWinner
} from 'components/dialogs/scoringObjectDialog/utils';
import { useStylesCommon, useStylesMatchParticipant } from 'components/dialogs/scoringObjectDialog/styles';
import useDebounce from '../../hooks/useDebounce';
import { None, Winner } from 'components/dialogs/scoringObjectDialog/constants';
import {
  FocusedSetInterface,
  MatchConfigurationInterface,
  ScoringMatchUpInterface,
  SetScoresInterface,
  SetWinnerEnum,
  StatusIconSideEnum
} from 'components/dialogs/scoringObjectDialog/typedefs/scoringTypes';
import { usePrevious } from '../../hooks/usePrevious';

import { drawEngine } from 'tods-competition-factory';

interface SetResultInputProps {
  isSide1: boolean;
  keyCodePressed: number;
  shiftPressed: boolean;
  set: SetScoresInterface;
  matchUp: ScoringMatchUpInterface;
  value: string;
  matchConfigParsed: MatchConfigurationInterface;
  isTiebreak?: boolean;
  isGamePointInput?: boolean;
  setMatchUp: (matchUp: ScoringMatchUpInterface) => void;
  openStatusDialog?: () => void;
}

const SetResultInput: React.FC<SetResultInputProps> = ({
  isSide1,
  keyCodePressed,
  shiftPressed,
  set,
  matchUp,
  value,
  matchConfigParsed,
  isTiebreak,
  isGamePointInput,
  setMatchUp
}) => {
  const classesCommon = useStylesCommon();
  const classes = useStylesMatchParticipant();
  const theme = useTheme();
  const mediaBreakPoints = useMediaQuery(theme.breakpoints.up('sm'));
  const finalSetFormat = matchConfigParsed?.finalSetFormat;
  const finalSetIsTiebreak =
    !!finalSetFormat?.tiebreakSet || !!(!finalSetFormat && matchConfigParsed?.setFormat?.tiebreakSet);
  const minimalSetNumberToBeFinal = Math.ceil(matchConfigParsed?.bestOf / 2);
  const setSide1OrSide2Winner = (!isSide1 && set.side1 > set.side2) || (isSide1 && set.side1 < set.side2);
  // introduced `isManuallyFocused to prevent debouncing when user selects value to edit
  const setIsManuallyFocused = set.isManuallyFocused !== FocusedSetInterface.NONE;
  const isDecisionSet = checkIfDecisionSet(set.setNumber, matchConfigParsed?.bestOf);
  const setFormat = matchConfigParsed?.setFormat;
  const timed = matchConfigParsed?.timed || setFormat?.timed;
  const setIsTiebreak = !!setFormat?.tiebreakSet;

  // second part of the condition uses matchConfigParsed.bestOf as the number of final set
  const noTiebreak =
    setFormat?.noTiebreak || (set.setNumber === matchConfigParsed?.bestOf && finalSetFormat?.noTiebreak);
  const shouldDebounce = isTiebreak || set.isTiebreakSet || noTiebreak;
  const debouncedInputValue = useDebounce(value, shouldDebounce ? 1000 : 0);
  const side: StatusIconSideEnum = isSide1 ? StatusIconSideEnum.side1 : StatusIconSideEnum.side2;
  const setTo = (isDecisionSet && finalSetFormat?.setTo) || setFormat?.setTo;
  const setTiebreakTo = setFormat?.tiebreakFormat?.tiebreakTo || setFormat?.tiebreakSet?.tiebreakTo;
  const finalSetTiebreakTo = finalSetFormat?.tiebreakFormat?.tiebreakTo || finalSetFormat?.tiebreakSet?.tiebreakTo;
  const tiebreakNoAd =
    (isDecisionSet && (finalSetFormat?.tiebreakFormat?.NoAD || finalSetFormat?.tiebreakSet?.NoAD)) ||
    setFormat?.tiebreakFormat?.NoAD ||
    setFormat?.tiebreakSet?.NoAD;
  const tiebreakTo = isDecisionSet || setIsTiebreak ? finalSetTiebreakTo || setTiebreakTo : setTiebreakTo;

  const setNoAd =
    set.setNumber === matchConfigParsed?.bestOf
      ? finalSetFormat && (finalSetFormat?.tiebreakFormat?.NoAD || finalSetFormat?.tiebreakSet?.NoAD)
      : setFormat?.NoAD;

  // checking previous props with custom hook
  const previousTiebreakValue = usePrevious(debouncedInputValue);
  const diffDebounced = previousTiebreakValue !== debouncedInputValue;
  // prevents re-render when status is changed which fixes the bug `unable to select retirement` and improves perf.
  const statusNotWinnerOrNone =
    (matchUp.status.side1?.categoryName !== Winner.categoryName &&
      matchUp.status.side1?.categoryName !== None.categoryName) ||
    (matchUp.status.side2?.categoryName !== Winner.categoryName &&
      matchUp.status.side2?.categoryName !== None.categoryName);

  // after the debouncedInputValue arrives (after 1000ms) it proceeds to the next set by updating the `matchUp` object
  // check if previousDebouncedInputValue is different than debouncedInputValue (that's from previous props)
  useEffect(() => {
    if (shouldDebounce && debouncedInputValue && !statusNotWinnerOrNone && diffDebounced && !setIsManuallyFocused) {
      const [tiebreakWinner, setTiebreakWinner] = hasTiebreakWinner(set, tiebreakTo);
      const setWinnerWithTiebreak = isTiebreak ? tiebreakWinner : setTiebreakWinner;
      const updatedSetsWithDebouncedTiebreak = matchUp.sets.map((currentSet) => {
        return currentSet.setNumber === set.setNumber
          ? {
              ...currentSet,
              isManuallyFocused: FocusedSetInterface.NONE,
              isActive: false,
              winner: setWinnerWithTiebreak
            }
          : currentSet;
      });
      const leader = findLeader(updatedSetsWithDebouncedTiebreak);
      const checkHasWinner = hasWinner(leader, minimalSetNumberToBeFinal);
      // with tiebreak Sets (custom configuration), `previous` is different from `debouncedInputValue` twice
      // (for both top and bottom inputs) so in that case new set is added the first time, it does not need
      // another addition
      const checkIfNewSetAdded = updatedSetsWithDebouncedTiebreak.find(
        (currentSet) => currentSet.setNumber === set.setNumber + 1
      );
      if (!checkHasWinner && setWinnerWithTiebreak !== SetWinnerEnum.NONE && !checkIfNewSetAdded) {
        updatedSetsWithDebouncedTiebreak.push({
          setNumber: ++set.setNumber,
          side1: '',
          side2: '',
          isActive: true,
          isManuallyFocused: FocusedSetInterface.NONE,
          isTiebreakSet: matchConfigParsed.bestOf === set.setNumber ? finalSetIsTiebreak : setIsTiebreak,
          winner: SetWinnerEnum.NONE
        });
      }
      // set status to winner only if the value is bigger than tiebreakTo. Otherwise if existing result is updated,
      // it can set status to Winner even if there's no winner
      const winnerIncludingTiebreak =
        checkHasWinner && set.isTiebreakSet
          ? Math.max(parseInt(set?.side1 || '0'), parseInt(set?.side2 || '0')) >= tiebreakTo
          : Math.max(parseInt(set?.tiebreak?.side1 || '0'), parseInt(set?.tiebreak?.side2 || '0')) >= tiebreakTo;
      setMatchUp({
        ...matchUp,
        sets: updatedSetsWithDebouncedTiebreak,
        status: {
          side1: checkHasWinner && winnerIncludingTiebreak && leader.side1 > leader.side2 ? Winner : None,
          side2: checkHasWinner && winnerIncludingTiebreak && leader.side1 < leader.side2 ? Winner : None
        }
      });
    }
  });

  // shift button is held - use keyCode passed from keyboard event, else use standard event target value
  const getKeyCodeOrEventValue = (event) => {
    return shiftPressed ? `${value}${String.fromCharCode(keyCodePressed)}` : event.target.value;
  };
  const validateKeyCodeOrEventValue = (keyCodeOrEventValue) => {
    return !(isNaN(keyCodeOrEventValue) && keyCodeOrEventValue !== '');
  };
  // key code for `space` button is 32
  const spacePressed = keyCodePressed === 32;
  // key code for `backspace` button is 8
  const backspacePressed = keyCodePressed === 8;

  const handleOnChangedTimedSet = (eventValue: string) => {
    const onlySet = matchUp.sets[0];
    const bumpSide1 = isSide1 && parseInt(eventValue) > (parseInt(onlySet?.side2) || 0);
    const bumpSide2 = !isSide1 && parseInt(eventValue) > (parseInt(onlySet?.side1) || 0);
    const isEqual =
      (isSide1 && parseInt(eventValue) === (parseInt(onlySet?.side2) || 0)) ||
      (!isSide1 && parseInt(eventValue) === (parseInt(onlySet?.side1) || 0));
    const statusSide1 = bumpSide1 ? Winner : !bumpSide2 && !isEqual ? matchUp.status.side1 : None;
    const statusSide2 = bumpSide2 ? Winner : !bumpSide1 && !isEqual ? matchUp.status.side2 : None;

    setMatchUp({
      ...matchUp,
      sets: [
        {
          ...onlySet,
          side1: isSide1 ? eventValue : onlySet?.side1 || '0',
          side2: !isSide1 ? eventValue : onlySet?.side2 || '0'
        }
      ],
      status: {
        side1: statusSide1,
        side2: statusSide2
      }
    });
  };

  const handleOnChange = (event) => {
    const keyCodeOrEventValue = getKeyCodeOrEventValue(event);
    if (!validateKeyCodeOrEventValue(keyCodeOrEventValue) || spacePressed) {
      return false;
    }
    let eventValue =
      (!setIsManuallyFocused && shouldDebounce) || timed
        ? keyCodeOrEventValue
        : keyCodeOrEventValue[keyCodeOrEventValue.length - 1] || '';

    eventValue = parseInt(eventValue || 0) > 99 ? 99 : parseInt(eventValue || 0);

    // handle timed set
    if (timed) {
      handleOnChangedTimedSet(eventValue.toString());
      return false;
    }

    // can't enter value bigger than `setTo` unless it's tiebreak / tiebreak set
    const tiebreakAt = finalSetFormat?.tiebreakAt ? finalSetFormat?.tiebreakAt : setFormat?.tiebreakAt;
    const maxLowSetScore = tiebreakAt < setTo ? tiebreakAt : setTo;
    const isBiggerThanMax = isTiebreak ? eventValue > tiebreakTo : eventValue > maxLowSetScore;
    if (!shouldDebounce && isBiggerThanMax) {
      return false;
    }

    // If the user is editing existing set, all sets after that need to be filtered out (deleted).
    // After that - there are many things that need to be handled in map.
    const newSetScores = matchUp.sets
      .filter((currentSet) => {
        if (setIsManuallyFocused) {
          return currentSet.setNumber <= set.setNumber;
        }
        return true;
      })
      .map((currentSet) => {
        if (set.setNumber === currentSet.setNumber) {
          const isCurrentDecisionSet = checkIfDecisionSet(currentSet.setNumber, matchConfigParsed?.bestOf);
          // tiebreak at depending on is it final set or regular set
          const tiebreakAt =
            isCurrentDecisionSet && finalSetFormat?.tiebreakAt ? finalSetFormat?.tiebreakAt : setFormat?.tiebreakAt;

          if (isTiebreak || currentSet.isTiebreakSet) {
            // if the tiebreak value is bigger than tiebreakTo, and user edits existing value in order to change status,
            // the other value has to be updated to the tiebreakTo in order for score to make sense
            // Same goes for tiebreakSets but just with side1 instead of tiebreak.side1

            // TODO: This was supposed to make it possible to edit a tiebreak score such that an incomplete tiebreak could be captured,
            // e.g. retirment due to injury or default due to penalty & etc.   Doesn't work!
            // const editModeTiebreak = !!set?.tiebreak?.side1 && !!set?.tiebreak?.side2; // Disabled for above reason
            const editModeTiebreak = false;

            // if user edited tiebreak (and not in tiebreak set), prevent entering value bigger than tiebreakTo
            if (editModeTiebreak && debouncedInputValue && !currentSet.isTiebreakSet && eventValue >= tiebreakTo) {
              return currentSet;
            }

            const tiebreakComplements = drawEngine.getTiebreakComplement({
              isSide1,
              lowValue: eventValue,
              tiebreakTo,
              tiebreakNoAd
            });
            const [side1ValueTiebreak, side2ValueTiebreak] = editModeTiebreak
              ? isSide1
                ? [eventValue, set?.tiebreak?.side2]
                : [set?.tiebreak?.side1, eventValue]
              : tiebreakComplements;

            // set value should only be reduced if it is bigger than tiebreakTo
            const reduceHigherSetValueSide1 =
              isSide1 && editModeTiebreak && !!debouncedInputValue && parseInt(currentSet.side1) > setTo;
            const reduceHigherSetValueSide2 =
              !isSide1 && editModeTiebreak && !!debouncedInputValue && parseInt(currentSet.side2) > setTo;

            const side1Result = getSetScoreIfTiebreak(
              side1ValueTiebreak.toString(),
              currentSet.side1,
              reduceHigherSetValueSide1,
              currentSet.isTiebreakSet,
              backspacePressed
            );
            const side2Result = getSetScoreIfTiebreak(
              side2ValueTiebreak.toString(),
              currentSet.side2,
              reduceHigherSetValueSide2,
              currentSet.isTiebreakSet,
              backspacePressed
            );

            return {
              ...currentSet,
              side1: backspacePressed ? '' : side1Result,
              side2: backspacePressed ? '' : side2Result,
              isManuallyFocused: FocusedSetInterface.NONE,
              tiebreak:
                currentSet.isTiebreakSet || backspacePressed
                  ? undefined
                  : {
                      side1: side1ValueTiebreak.toString(),
                      side2: side2ValueTiebreak.toString()
                    },
              winner:
                backspacePressed || set.isActive
                  ? SetWinnerEnum.NONE
                  : side1ValueTiebreak > side2ValueTiebreak
                  ? SetWinnerEnum.SIDE1
                  : SetWinnerEnum.SIDE2
            };
          }

          const [side1Value, side2Value] =
            set.winner !== SetWinnerEnum.NONE
              ? [isSide1 ? eventValue : parseInt(set.side1 || '0'), !isSide1 ? eventValue : parseInt(set.side2 || '0')]
              : drawEngine.getSetComplement({
                  setTo,
                  isSide1,
                  lowValue: eventValue,
                  tiebreakAt
                });

          const isCurrentTiebreak = !noTiebreak && side1Value >= (tiebreakAt || 0) && side2Value >= (tiebreakAt || 0);

          const hasWinningSide = drawEngine.checkSetIsComplete({
            isDecidingSet: isDecisionSet,
            isTiebreakSet: currentSet.isTiebreakSet,
            matchUpScoringFormat: matchConfigParsed,
            set: { side1Score: side1Value, side2Score: side2Value },
            ignoreTiebreak: true
          });

          const hasWinner = hasWinningSide
            ? side1Value > side2Value
              ? SetWinnerEnum.SIDE1
              : SetWinnerEnum.SIDE2
            : SetWinnerEnum.NONE;

          return {
            setNumber: currentSet.setNumber,
            side1: backspacePressed ? '' : side1Value.toString(),
            side2: backspacePressed ? '' : side2Value.toString(),
            isActive: backspacePressed
              ? true
              : noTiebreak
              ? !debouncedInputValue
              : isCurrentTiebreak && set.winner === SetWinnerEnum.NONE,
            isManuallyFocused: FocusedSetInterface.NONE,
            isTiebreakSet: currentSet.isTiebreakSet,
            tiebreak: isCurrentTiebreak ? { side1: '', side2: '' } : undefined,
            winner: hasWinner
          };
        }
        return currentSet;
      });

    const leader = findLeader(newSetScores);
    const checkHasWinner = hasWinner(leader, minimalSetNumberToBeFinal);
    const lastSet = newSetScores[newSetScores.length - 1];
    const lastSetHasWinner = lastSet.winner !== SetWinnerEnum.NONE;

    // !lastSet.isActive is there for tiebreak sets - if the set is active, there's no winner
    const updatedMatchWithStatus = {
      ...matchUp,
      sets: newSetScores,
      status: {
        side1: checkHasWinner && !lastSet.isActive && lastSetHasWinner && leader.side1 > leader.side2 ? Winner : None,
        side2: checkHasWinner && !lastSet.isActive && lastSetHasWinner && leader.side1 < leader.side2 ? Winner : None
      }
    };

    const isFinalSet = setIsManuallyFocused
      ? minimalSetNumberToBeFinal === matchUp.sets.length
      : minimalSetNumberToBeFinal === set.setNumber;

    // !lastSet.isActive prevents adding new empty sets if tiebreak is being entered
    // lastSetHasWinner - gets last existing set and if no one won that set, new set can't be added
    if (!lastSet.isActive && lastSetHasWinner && !checkHasWinner && !timed) {
      newSetScores.push({
        setNumber: newSetScores.length + 1,
        side1: '',
        side2: '',
        isActive: true,
        isManuallyFocused: FocusedSetInterface.NONE,
        isTiebreakSet: isFinalSet ? finalSetIsTiebreak : setIsTiebreak,
        winner: SetWinnerEnum.NONE
      });
    }
    setMatchUp(updatedMatchWithStatus);
  };

  const handleOnChangeGameResult = (event) => {
    const keyCodeOrEventValue = getKeyCodeOrEventValue(event);
    const firstDigitInGame = ['0', '1', '3', '4', 'a'];
    const eventValue = keyCodeOrEventValue[keyCodeOrEventValue.length - 1];
    if (!firstDigitInGame.includes(eventValue)) {
      return false;
    }
    const updatedSets = matchUp.sets.map((currentSet) => {
      const completedValue = gameAutoCompleter(isSide1, currentSet, setNoAd, eventValue);
      return currentSet.setNumber === set.setNumber
        ? {
            ...currentSet,
            gameResult: {
              side1: isSide1 ? completedValue : currentSet.gameResult.side1,
              side2: !isSide1 ? completedValue : currentSet.gameResult.side2
            }
          }
        : currentSet;
    });
    const updatedMatch: ScoringMatchUpInterface = {
      ...matchUp,
      sets: updatedSets
    };
    setMatchUp(updatedMatch);
  };

  const handleFocusSet = () => {
    const updatedSets = matchUp.sets.map((currentSet) => ({
      ...currentSet,
      isActive: currentSet.setNumber === set.setNumber,
      isManuallyFocused:
        currentSet.setNumber === set.setNumber
          ? isSide1
            ? FocusedSetInterface.SIDE1
            : FocusedSetInterface.SIDE2
          : FocusedSetInterface.NONE
    }));
    setMatchUp({
      ...matchUp,
      sets: updatedSets
    });
  };
  const handleInputRefFocus = (input) => {
    if (input) {
      if (!shiftPressed && setIsManuallyFocused) {
        return (set.isManuallyFocused === FocusedSetInterface.SIDE1 && isSide1) ||
          (set.isManuallyFocused === FocusedSetInterface.SIDE2 && !isSide1)
          ? input.focus()
          : input.blur();
      }
      if (isTiebreak) {
        // if the user is entering tiebreak result, focus lower end input (input where he should enter lower value)
        return setSide1OrSide2Winner && input.focus();
      }
      // this prevents losing focus from input in tiebreak
      if (!set?.tiebreak) {
        return (shiftPressed && isSide1) || (!shiftPressed && !isSide1) ? input.focus() : input.blur();
      }
    }
  };

  const handleOnClick = () => {
    setMatchUp({
      ...matchUp,
      sets: matchUp.sets.map((currentSet) =>
        currentSet.setNumber === set.setNumber
          ? {
              ...currentSet,
              isManuallyFocused: isSide1 ? FocusedSetInterface.SIDE1 : FocusedSetInterface.SIDE2
            }
          : currentSet
      )
    });
  };

  const stringValue = value !== undefined && value.toString();
  return (
    <Grid item className={mediaBreakPoints ? classesCommon.setEntry : classesCommon.setEntryXS}>
      <>
        {set.isActive || isTiebreak || (isGamePointInput && !timed) ? (
          <TextField
            className={`tmxInput ${classes.setResultInputField}${isTiebreak ? ' tmxInputTiebreak' : ''}`}
            data-side={side}
            inputRef={handleInputRefFocus}
            value={value}
            disabled={!setIsManuallyFocused ? isTiebreak && !setSide1OrSide2Winner : false}
            onChange={isGamePointInput ? handleOnChangeGameResult : handleOnChange}
            onClick={handleOnClick}
            placeholder="-"
            variant="outlined"
          />
        ) : (
          <>
            {set.tiebreak ? (
              isSide1 ? (
                <sup
                  className={`tmxInputSuperscript ${
                    mediaBreakPoints ? classes.tiebreakSuperscript : classes.tiebreakSuperscriptXS
                  }`}
                >
                  {set.tiebreak.side1}
                </sup>
              ) : (
                <sup
                  className={`tmxInputSuperscript ${
                    mediaBreakPoints ? classes.tiebreakSuperscript : classes.tiebreakSuperscriptXS
                  }`}
                >
                  {set.tiebreak.side2}
                </sup>
              )
            ) : null}
            <Typography
              className={`tmxInputValueDisplay ${
                mediaBreakPoints ? classes.setResultTypography : classes.setResultTypographyXS
              }`}
              onClick={handleFocusSet}
            >
              {stringValue || '-'}{' '}
            </Typography>
          </>
        )}
      </>
    </Grid>
  );
};

export default SetResultInput;
