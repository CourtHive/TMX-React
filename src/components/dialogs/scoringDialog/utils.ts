import {
  FocusedSetInterface,
  ScoringMatchUpInterface,
  MatchParticipantStatusCategory,
  SetScoresInterface,
  SetWinnerEnum,
  WonSets
} from 'components/dialogs/scoringDialog/typedefs/scoringTypes';
import React from 'react';
import { None, Winner } from 'components/dialogs/scoringDialog/constants';

export const getValue = (
  isSide1: boolean,
  value: string,
  to: number,
  noAd: boolean,
  isNotTiebreak: boolean,
  tiebreakNoAd: boolean,
  tiebreakAt: number,
  isTiebreakSet?: boolean
) => {
  let valueAsNumber = parseInt(value);
  if (valueAsNumber?.toString().length > 2) {
    valueAsNumber = parseInt(valueAsNumber.toString().slice(0, 2));
  }
  if ((tiebreakNoAd || (isTiebreakSet && noAd)) && valueAsNumber > to - 1) {
    valueAsNumber = valueAsNumber = to - 1;
  }

  const side1Result = isSide1
    ? valueAsNumber
    : (noAd && isNotTiebreak) || (noAd && isTiebreakSet)
    ? valueAsNumber < to
      ? to
      : to + 1
    : valueAsNumber + 1 < to
    ? to
    : (tiebreakNoAd && valueAsNumber === to - 1) ||
      (!tiebreakNoAd && valueAsNumber === to - 2) ||
      (!isTiebreakSet && tiebreakAt)
    ? valueAsNumber + 1
    : valueAsNumber + 2;
  const side2Result = !isSide1
    ? valueAsNumber
    : (noAd && isNotTiebreak) || (noAd && isTiebreakSet)
    ? valueAsNumber < to
      ? to
      : to + 1
    : valueAsNumber + 1 < to
    ? to
    : (tiebreakNoAd && valueAsNumber === to - 1) ||
      (!tiebreakNoAd && valueAsNumber === to - 2) ||
      (!isTiebreakSet && tiebreakAt)
    ? valueAsNumber + 1
    : valueAsNumber + 2;

  return [side1Result, side2Result];
};

export const findLeader = (sets: SetScoresInterface[], bumpSide1?: boolean, bumpSide2?: boolean) =>
  sets.reduce<WonSets>(calculateWonSetsReducer, {
    side1: bumpSide1 ? 1 : 0,
    side2: bumpSide2 ? 1 : 0
  });

export const hasWinner = (winner: WonSets, minimalSetNumberToBeFinal: number): boolean =>
  Math.max(winner.side1, winner.side2) === minimalSetNumberToBeFinal;

export const hasTiebreakWinner = (set: SetScoresInterface, tiebreakTo: number) => {
  const setSide1 = parseInt(set?.side1 || '0');
  const setSide2 = parseInt(set?.side2 || '0');
  const setTiebreakSide1 = parseInt(set?.tiebreak?.side1 || '0');
  const setTiebreakSide2 = parseInt(set?.tiebreak?.side2 || '0');
  const tiebreakWinner =
    setTiebreakSide1 > setTiebreakSide2 && setTiebreakSide1 >= tiebreakTo
      ? SetWinnerEnum.SIDE1
      : setTiebreakSide1 < setTiebreakSide2 && setTiebreakSide2 >= tiebreakTo
      ? SetWinnerEnum.SIDE2
      : SetWinnerEnum.NONE;
  const setTiebreakWinner =
    setSide1 > setSide2 && setSide1 >= tiebreakTo
      ? SetWinnerEnum.SIDE1
      : setSide1 < setSide2 && setSide2 >= tiebreakTo
      ? SetWinnerEnum.SIDE2
      : SetWinnerEnum.NONE;
  return [tiebreakWinner, setTiebreakWinner];
};

export const calculateWonSetsReducer = (previousValue, currentValue) => ({
  side1:
    currentValue.winner === SetWinnerEnum.SIDE1 || parseInt(currentValue?.side1) > parseInt(currentValue?.side2)
      ? previousValue.side1 + 1
      : previousValue.side1,
  side2:
    currentValue.winner === SetWinnerEnum.SIDE2 || parseInt(currentValue?.side2) > parseInt(currentValue?.side1)
      ? previousValue.side2 + 1
      : previousValue.side2
});

export const getSetsIfNotExistingScore = (isTiebreakSet?: boolean) => {
  const setsIfNotExisting: SetScoresInterface[] = [
    {
      setNumber: 1,
      side1: '',
      side2: '',
      isActive: true,
      winner: SetWinnerEnum.NONE,
      isTiebreakSet: isTiebreakSet,
      isManuallyFocused: FocusedSetInterface.NONE
    }
  ];
  return setsIfNotExisting;
};

export const defaultChangeCategory = (
  event: React.ChangeEvent<{ name?: string; value: unknown }>,
  isSide1: boolean,
  matchUp: ScoringMatchUpInterface,
  setTo: number,
  categories: MatchParticipantStatusCategory[],
  setMatchUp: (matchUp: ScoringMatchUpInterface) => void
) => {
  const category = categories.find((category) => category.label === event.target.value);
  const firstSubcategory = category.subCategories[0];
  const status = {
    categoryName: category.label,
    subCategoryName: firstSubcategory.label,
    tdmCode: firstSubcategory.tdmCode
  };
  const isRetirement = category.label === 'Retirements';
  const isWalkover = category.label === 'Walkovers';
  const isDefault = category.label === 'Defaults';
  const isOtherSideWinner = isRetirement || isDefault || isWalkover;
  const setsWithGamePointInputs: SetScoresInterface[] = !isRetirement
    ? matchUp.sets
    : matchUp.sets.map((set, index) => {
        if (index === matchUp.sets.length - 1 && !set.isTiebreakSet && !set.tiebreak) {
          return {
            ...set,
            gameResult: {
              side1: '0',
              side2: '0'
            }
          };
        }
        return set;
      });
  const lastSet = matchUp.sets[matchUp.sets.length - 1];
  const lastIsTiebreakOrTiebreakSet = lastSet?.tiebreak?.side1 || lastSet?.tiebreak?.side2 || lastSet.isTiebreakSet;

  if (!lastIsTiebreakOrTiebreakSet && lastSet.winner !== SetWinnerEnum.NONE) {
    setsWithGamePointInputs.push({
      setNumber: setsWithGamePointInputs.length + 1,
      side1: '0',
      side2: '0',
      isManuallyFocused: FocusedSetInterface.SIDE2,
      winner: SetWinnerEnum.NONE,
      gameResult: {
        side1: '0',
        side2: '0'
      }
    });
  }

  const updatedSets = isRetirement || isDefault ? setsWithGamePointInputs : matchUp.sets;

  setMatchUp({
    ...matchUp,
    sets: updatedSets,
    status: {
      side1: isSide1 ? status : isOtherSideWinner ? Winner : None,
      side2: !isSide1 ? status : isOtherSideWinner ? Winner : None
    }
  });
};

export const gameAutoCompleter = (isSide1: boolean, currentSet: any, noAd: boolean, value: string) => {
  const otherSide = isSide1 ? currentSet?.gameResult?.side2 : currentSet?.gameResult?.side1;
  switch (value) {
    case '0':
      if (otherSide === 'AD') {
        return '40';
      } else {
        return '0';
      }
    case '1':
      if (otherSide === 'AD') {
        return '40';
      } else {
        return '15';
      }
    case '3':
      if (otherSide === 'AD') {
        return '40';
      } else {
        return '30';
      }
    case '4':
      return '40';
    case 'a':
      if (otherSide === '40') {
        return 'AD';
      } else if (otherSide === 'AD') {
        return '40';
      } else {
        return '0';
      }
    default:
      return '0';
  }
};

export const checkIfDecisionSet = (setNumber: number, bestOf: number): boolean => {
  return setNumber === bestOf;
};

export const getSetScoreIfTiebreak = (
  tiebreakValue: string,
  setValue: string,
  reduceSetValue?: boolean,
  isTiebreakSet?: boolean,
  backspacePressed?: boolean
) => {
  return isTiebreakSet
    ? backspacePressed
      ? ''
      : tiebreakValue
    : reduceSetValue
    ? (parseInt(setValue) - 1).toString()
    : setValue;
};
