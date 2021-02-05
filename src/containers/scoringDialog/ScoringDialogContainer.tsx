import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { statusCategories } from 'containers/scoringDialog/constants';
import ScoringDialog from 'components/dialogs/scoringDialog/ScoringDialog';
import { matchUpFormatCode } from 'tods-matchup-format-code';
import { getSetsIfNotExistingScore } from 'components/dialogs/scoringDialog/utils';
import StatusDisplayFactory from 'components/dialogs/scoringDialog/StatusDisplayFactory';
import {
  MatchConfigurationInterface,
  ScoringMatchUpInterface,
  SetWinnerEnum
} from 'components/dialogs/scoringDialog/typedefs/scoringTypes';
import { getScore } from 'containers/scoringDialog/utils';
import { SideInterface } from 'typedefs/store/tmxTypes';
import { Winner, None } from 'components/dialogs/scoringDialog/constants';
import { MatchUpInterface } from 'typedefs/store/scheduleTypes';
import { useDispatch } from 'react-redux';

import { matchUpStatusConstants } from 'tods-competition-factory';
const { RETIRED, DEFAULTED, WALKOVER } = matchUpStatusConstants;
// import { RETIRED, DEFAULTED, WALKOVER } from 'competitionFactory/constants/matchUpStatusConstants';

interface ScoringDialogContainerType {
  matchUp: MatchUpInterface;
  matchUpFormat?: string;
  handleClose: Function;
}

const ScoringDialogContainer: React.FC<ScoringDialogContainerType> = ({ matchUp, matchUpFormat, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const sides = matchUp?.sides as SideInterface[];

  const validSides = sides?.reduce((valid, side) => Boolean(valid && side.participantId), true);

  const sideParticipants =
    sides?.map((side) => {
      const participants = side?.participant?.individualParticipants || [side.participant];
      return participants.map((participant) => {
        const person = participant?.person;
        return {
          firstName: person?.standardGivenName,
          lastName: person?.standardFamilyName,
          nationalityCode: person?.nationalityCode,
          id: person?.personId || participant?.participantId
          // TODO: scoreDialog can later transition to accessing person object directly
        };
      });
    }) || [];

  matchUpFormat = matchUp?.matchUpFormat || matchUpFormat || 'SET3-S:6/TB7';

  const [matchConfigParsed, setMatchConfigParsed] = useState<MatchConfigurationInterface>(
    matchUpFormatCode.parse(matchUpFormat) as MatchConfigurationInterface
  );
  const [participantSide1, participantSide2] = sideParticipants;
  const isSetFormatTiebreakSet = !!matchConfigParsed?.setFormat?.tiebreakSet;

  const roundNumber = matchUp?.roundNumber;
  const roundName = roundNumber && `${t('Round')} ${roundNumber || ''}`;

  const TODSsets = (sets) =>
    sets.map((set) => {
      const side1TiebreakScore = parseInt(set.isTiebreakSet ? set.side1 : set.tiebreak?.side1);
      const side2TiebreakScore = parseInt(set.isTiebreakSet ? set.side2 : set.tiebreak?.side2);
      return {
        setNumber: set.setNumber,
        side1Score: set.isTiebreakSet ? undefined : parseInt(set.side1) || 0,
        side2Score: set.isTiebreakSet ? undefined : parseInt(set.side2) || 0,
        side1TiebreakScore: !isNaN(side1TiebreakScore) && side1TiebreakScore,
        side2TiebreakScore: !isNaN(side2TiebreakScore) && side2TiebreakScore,
        winningSide: set.winner === 'SIDE1' ? 1 : set.winner === 'SIDE2' ? 2 : undefined
      };
    });

  const SDsets = (sets) =>
    sets.map((set) => {
      const isTiebreakSet = (set.side1TiebreakScore || set.side2TiebreakScore) && !set.side1Score && !set.side2Score;
      const tiebreak = !isTiebreakSet &&
        set.side1TiebreakScore !== undefined &&
        set.side2TiebreakScore !== undefined && {
          side1: set.side1TiebreakScore,
          side2: set.side2TiebreakScore
        };
      return {
        setNumber: set.setNumber,
        isTiebreakSet,
        side1: parseInt(isTiebreakSet ? set.side1TiebreakScore : set.side1Score) || 0,
        side2: parseInt(isTiebreakSet ? set.side2TiebreakScore : set.side2Score) || 0,
        tiebreak,
        winner: set.winner === 1 ? 'SIDE1' : set.winner === 2 ? 'SIDE2' : undefined
      };
    });

  const emptyMatch: ScoringMatchUpInterface = {
    participantSide1,
    participantSide2,
    roundName: '',
    sets: getSetsIfNotExistingScore(isSetFormatTiebreakSet),
    status: {
      side1: None,
      side2: None
    }
  };

  const scoreSets = matchUp?.sets && SDsets(matchUp.sets);
  const side1Status = matchUp?.winningSide === 1 ? Winner : None;
  const side2Status = matchUp?.winningSide === 2 ? Winner : None;

  /*
  // tdmCode and subCategoryName have no place to be stored on matchUp object
  // without these attributes the scoring interface is unreliable

  if (matchUp?.matchUpStatus === RETIRED) {
    if (matchUp.winningSide === 2) {
      side1Status.categoryName = 'Retirements';
    } else {
      side2Status.categoryName = 'Retirements';
    }
  }
  */

  const initialMatch: ScoringMatchUpInterface = {
    participantSide1,
    participantSide2,
    roundName,
    sets: scoreSets || getSetsIfNotExistingScore(isSetFormatTiebreakSet),
    status: {
      side1: side1Status,
      side2: side2Status
    }
  };
  const [scoringMatchUp, setMatch] = useState<ScoringMatchUpInterface>(initialMatch);
  const noScore =
    !scoringMatchUp.sets ||
    scoringMatchUp.sets.length < 1 ||
    (scoringMatchUp.sets.length === 1 && !scoringMatchUp.sets[0].side1 && !scoringMatchUp.sets[0].side2);
  // if there's no score, its not possible to select Retirement status
  const filteredStatusCategories = statusCategories.filter((statusCategory) =>
    noScore ? statusCategory.label !== 'Retirements' : true
  );

  const closeDialog = () => {
    handleClose();
  };
  const handleClearScore = () => {
    setMatch(emptyMatch);
  };
  const processScoringOutcome = ({ outcome, matchUp }) => {
    const { matchUpFormat } = outcome;
    console.log({ outcome });
    const { drawId, matchUpId, matchUpTieId } = matchUp;
    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'setMatchUpStatus',
            params: { drawId, matchUpId, matchUpTieId, matchUpFormat, outcome }
          }
        ]
      }
    });
  };
  const handleSave = () => {
    const setsIfExisting = scoringMatchUp?.sets;
    const setWithoutWinnerExists = !!setsIfExisting?.find(
      (currentSet) => !currentSet.winner || currentSet.winner === SetWinnerEnum.NONE
    );
    const side1StatusCategoryName = scoringMatchUp?.status?.side1?.categoryName;
    const side2StatusCategoryName = scoringMatchUp?.status?.side2?.categoryName;
    const isIncompleteScore =
      setWithoutWinnerExists && side1StatusCategoryName === 'None' && side2StatusCategoryName === 'None';
    const checkStatusWinner = (sideNumber) =>
      scoringMatchUp?.status && scoringMatchUp.status[`side${sideNumber}`].categoryName === 'Winner';
    const statusWinner = checkStatusWinner(1) ? 1 : checkStatusWinner(2) ? 2 : undefined;
    const winningSide = !isIncompleteScore && statusWinner;
    const score = getScore(scoringMatchUp, winningSide);

    const isRetirement = side1StatusCategoryName === 'Retirements' || side2StatusCategoryName === 'Retirements';
    const isWalkover = side1StatusCategoryName === 'Walkovers' || side2StatusCategoryName === 'Walkovers';
    const isDefault = side1StatusCategoryName === 'Defaults' || side2StatusCategoryName === 'Defaults';
    const matchUpStatus = isRetirement ? RETIRED : isDefault ? DEFAULTED : isWalkover ? WALKOVER : undefined;

    const outcome = {
      score,
      matchUpStatus,
      status: scoringMatchUp.status,
      sets: TODSsets(scoringMatchUp.sets),
      winningSide: winningSide || undefined,
      matchUpFormat: matchUpFormatCode.stringify(matchConfigParsed)
    };
    if (outcome) {
      processScoringOutcome({ outcome, matchUp });
    }

    // also pass outcome back to calling context
    // this is used by /test route
    handleClose({ outcome, matchUp });
  };
  const scoreFormatChange = (matchConfigParsed: MatchConfigurationInterface) => {
    handleClearScore();
    setMatchConfigParsed(matchConfigParsed);
  };

  if (!validSides) {
    handleClose();
    return null;
  }

  return (
    <>
      <ScoringDialog
        id="score-dialog"
        isOpen={!!matchUp}
        matchConfigParsed={matchConfigParsed}
        matchUp={scoringMatchUp}
        statusCategories={filteredStatusCategories}
        StatusDisplayFactory={StatusDisplayFactory}
        setMatchUp={setMatch}
        closeDialog={closeDialog}
        clearScore={handleClearScore}
        scoreFormatChange={scoreFormatChange}
        save={handleSave}
        closeStatusDialog={closeDialog}
      />
    </>
  );
};

export default ScoringDialogContainer;
