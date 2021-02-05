import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { isDev } from 'functions/isDev';

// containers
import { TODSsets } from 'containers/scoringObjectDialog/utils';
import { statusCategories } from 'containers/scoringObjectDialog/constants';

// components
import { None, Winner } from 'components/dialogs/scoringObjectDialog/constants';
import ScoringDialog from 'components/dialogs/scoringObjectDialog/ScoringDialog';
import { getSetsIfNotExistingScore } from 'components/dialogs/scoringObjectDialog/utils';
import StatusDisplayFactory from 'components/dialogs/scoringObjectDialog/StatusDisplayFactory';

import { matchUpFormatCode } from 'tods-matchup-format-code';
import { drawEngine, matchUpStatusConstants } from 'tods-competition-factory';

// policies
import { ROUND_NAMING_DEFAULT } from 'policies/ROUND_NAMING';
import { PARTICIPANT_PRIVACY_DEFAULT } from 'policies/PARTICIPANT_PRIVACY_POLICY';
import { SCORING_USTA } from 'policies/SCORING_USTA';

// typedefs
import { MatchUpInterface } from 'typedefs/store/scheduleTypes';
import { SideInterface } from 'typedefs/store/tmxTypes';
import {
  FocusedSetInterface,
  MatchConfigurationInterface,
  SetWinnerEnum
} from 'components/dialogs/scoringObjectDialog/typedefs/scoringTypes';

// constants
const { RETIRED, DEFAULTED, WALKOVER } = matchUpStatusConstants;

interface ScoringDialogContainerType {
  open?: boolean;
  matchUp: MatchUpInterface;
  matchUpFormat?: string;
  drawPublishState?: any;
  handleClose: any;
}

const ScoringDialogContainer: React.FC<ScoringDialogContainerType> = ({
  open,
  matchUp,
  matchUpFormat,
  drawPublishState,
  handleClose
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const sides = matchUp?.sides as SideInterface[];
  const sideParticipants =
    sides?.map((side) => {
      const isDoubles = side?.participant?.individualParticipants?.length;
      const participants = (isDoubles && side.participant.individualParticipants) || [side.participant ?? {}];
      return participants?.map((participant) => {
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

  const defaultMatchUpFormat = SCORING_USTA.scoring.defaultMatchUpFormat;
  const matchFormatFromMatchUpOrDraw = matchUpFormatCode.parse(
    matchUp?.matchUpFormat || matchUpFormat || defaultMatchUpFormat
  ) as MatchConfigurationInterface;
  const [matchConfigParsed, setMatchConfigParsed] = useState<MatchConfigurationInterface>(matchFormatFromMatchUpOrDraw);
  const [participantSide1, participantSide2] = sideParticipants;
  const roundNumber = matchUp?.roundNumber;
  const roundName = matchUp?.roundName || (roundNumber && `${t('Round')} ${roundNumber || ''}`);
  const scoreSets = matchUp?.score?.sets && SDsets(matchUp);

  const matchUpStatusCode = matchUp && matchUp.matchUpStatusCodes ? matchUp.matchUpStatusCodes[0] : undefined;
  const category = statusCategories.find((category) =>
    category.subCategories.find((subCategory) => subCategory.matchUpStatusCode === matchUpStatusCode)
  );
  const subCategory = category
    ? category.subCategories.find((subCategory) => subCategory.matchUpStatusCode === matchUpStatusCode)
    : undefined;

  const side1Status =
    matchUp?.winningSide === 1
      ? Winner
      : category
      ? {
          categoryName: category.label,
          subCategoryName: subCategory?.label,
          matchUpStatusCodeDisplay: subCategory.matchUpStatusCodeDisplay,
          matchUpStatusCode: subCategory.matchUpStatusCode
        }
      : None;
  const side2Status =
    matchUp?.winningSide === 2
      ? Winner
      : category
      ? {
          categoryName: category.label,
          subCategoryName: subCategory.label,
          matchUpStatusCodeDisplay: subCategory.matchUpStatusCodeDisplay,
          matchUpStatusCode: subCategory.matchUpStatusCode
        }
      : None;

  const initialMatch = getInitialMatch(false);
  const [scoringMatchUp, setScoringMatchUp] = useState(initialMatch);
  const scoringMatchUpComplete = { ...scoringMatchUp, participantSide1, participantSide2 };

  const noScore =
    scoringMatchUpComplete.sets.length <= 1 &&
    scoringMatchUpComplete.sets[0]?.side1 === undefined &&
    scoringMatchUpComplete.sets[0]?.side2 === undefined;
  // if there's no score, its not possible to select Retirement status
  const filteredStatusCategories = statusCategories.filter((statusCategory) =>
    noScore ? !(statusCategory.label === 'Retirements') : true
  );

  const closeDialog = () => {
    const emptyMatch = getInitialMatch(true, matchFormatFromMatchUpOrDraw);
    handleClose();
    setMatchConfigParsed(matchFormatFromMatchUpOrDraw);
    setScoringMatchUp(emptyMatch);
  };
  const handleClearScore = (matchConfigParsed?: MatchConfigurationInterface) => {
    const emptyMatch = getInitialMatch(true, matchConfigParsed);
    setScoringMatchUp(emptyMatch);
  };
  const processScoringOutcome = ({ outcome, matchUp }) => {
    const { matchUpFormat } = outcome;
    const { drawId, eventId, matchUpId, matchUpTieId } = matchUp;
    const params = { drawId, matchUpId, matchUpTieId, matchUpFormat, outcome };
    const eventPolicy = Object.assign({}, ROUND_NAMING_DEFAULT, PARTICIPANT_PRIVACY_DEFAULT);
    const publishMethod = drawPublishState && {
      method: 'publishEvent',
      params: { drawIds: [drawId], eventId, policyDefinition: eventPolicy }
    };
    if (outcome?.score?.sets) {
      outcome.score.sets = outcome.score.sets.filter(
        (set) => set.side1Score || set.side2Score || set.side1TiebreakScore || set.side2TiebreakScore
      );
    }
    const methods = [{ method: 'setMatchUpStatus', params }, publishMethod].filter((f) => f);
    if (isDev() && methods.length > 1) console.log('%c RE-PUBLISHED', 'color: lightgreen');
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
  const setInitialMatchUp = () => {
    const initialMatchUp = getInitialMatch(false);
    const scoringMatchUpComplete = { ...initialMatchUp, participantSide1, participantSide2 };
    setScoringMatchUp(scoringMatchUpComplete);
    setMatchConfigParsed(matchFormatFromMatchUpOrDraw);
  };
  const handleSave = () => {
    const setsIfExisting = scoringMatchUpComplete?.sets;
    const setWithoutWinnerExists = !!setsIfExisting?.find(
      (currentSet) => !currentSet.winner || currentSet.winner === SetWinnerEnum.NONE
    );
    const side1StatusCategoryName = scoringMatchUpComplete?.status?.side1?.categoryName;
    const side2StatusCategoryName = scoringMatchUpComplete?.status?.side2?.categoryName;
    const isIncompleteScore =
      setWithoutWinnerExists && side1StatusCategoryName === 'None' && side2StatusCategoryName === 'None';
    const checkStatusWinner = (sideNumber) =>
      scoringMatchUpComplete?.status && scoringMatchUpComplete.status[`side${sideNumber}`].categoryName === 'Winner';
    const statusWinner = checkStatusWinner(1) ? 1 : checkStatusWinner(2) ? 2 : undefined;
    const winningSide = !isIncompleteScore && statusWinner;
    const sets = TODSsets(scoringMatchUpComplete.sets);
    const score = {
      scoreStringSide1: drawEngine.generateScoreString({ sets }),
      scoreStringSide2: drawEngine.generateScoreString({ sets, reversed: true })
    };
    const isRetirement = side1StatusCategoryName === 'Retirements' || side2StatusCategoryName === 'Retirements';
    const isWalkover = side1StatusCategoryName === 'Walkovers' || side2StatusCategoryName === 'Walkovers';
    const isDefault = side1StatusCategoryName === 'Defaults' || side2StatusCategoryName === 'Defaults';
    const matchUpStatus = isRetirement ? RETIRED : isDefault ? DEFAULTED : isWalkover ? WALKOVER : undefined;
    const matchUpFormat = matchUpFormatCode.stringify(matchConfigParsed);

    const matchUpStatusCodes = [
      scoringMatchUpComplete.status.side1.matchUpStatusCode,
      scoringMatchUpComplete.status.side2.matchUpStatusCode
    ].filter((f) => f);

    const outcome = {
      score: {
        ...score,
        sets: sets
      },
      matchUpStatus,
      matchUpStatusCodes,
      status: scoringMatchUpComplete.status,
      winningSide: winningSide || undefined,
      matchUpFormat
    };

    processScoringOutcome({ outcome, matchUp });
    handleClose({ outcome, matchUp });
  };
  const scoreFormatChange = (matchConfigParsed: MatchConfigurationInterface) => {
    setMatchConfigParsed(matchConfigParsed);
    handleClearScore(matchConfigParsed);
  };
  function SDsets(matchUp) {
    const sets = matchUp?.score?.sets;
    const setsWithWinningSide = sets?.filter((set) => set.winningSide).length;
    const allSetsHaveWinningSide = setsWithWinningSide === sets.length;
    const missingSet = allSetsHaveWinningSide && !matchUp.winningSide;
    const setsToProcess = missingSet
      ? sets.concat([{ setNumber: sets.length + 1, side1Score: 0, side2Score: 0 }])
      : sets;
    return setsToProcess.map((set, index) => {
      const isTiebreakSet = (set.side1TiebreakScore || set.side2TiebreakScore) && !set.side1Score && !set.side2Score;
      const tiebreak = !isTiebreakSet &&
        ![undefined, false].includes(set.side1TiebreakScore) &&
        ![undefined, false].includes(set.side2TiebreakScore) && {
          side1: set.side1TiebreakScore,
          side2: set.side2TiebreakScore
        };
      return {
        isActive: setsToProcess.length - 1 === index,
        isManuallyFocused: FocusedSetInterface.NONE,
        setNumber: set.setNumber,
        isTiebreakSet,
        side1: parseInt(isTiebreakSet ? set.side1TiebreakScore : set.side1Score) || '',
        side2: parseInt(isTiebreakSet ? set.side2TiebreakScore : set.side2Score) || '',
        tiebreak,
        winner:
          set.winningSide === 1 ? SetWinnerEnum.SIDE1 : set.winningSide === 2 ? SetWinnerEnum.SIDE2 : SetWinnerEnum.NONE
      };
    });
  }
  function getInitialMatch(isEmpty?: boolean, mcp?: MatchConfigurationInterface) {
    const parsedConfig = mcp ? mcp : matchConfigParsed;
    const matchUpFormatDecided =
      parsedConfig || (matchUpFormatCode.parse(matchUpFormat) as MatchConfigurationInterface);
    const isSetFormatTiebreakSet = !!matchUpFormatDecided?.setFormat?.tiebreakSet;
    return {
      roundName,
      sets: isEmpty
        ? getSetsIfNotExistingScore(isSetFormatTiebreakSet)
        : scoreSets || getSetsIfNotExistingScore(isSetFormatTiebreakSet),
      status: {
        side1: isEmpty ? None : side1Status,
        side2: isEmpty ? None : side2Status
      }
    };
  }

  return (
    <>
      <ScoringDialog
        id="score-dialog"
        isOpen={!!open}
        matchConfigParsed={matchConfigParsed}
        matchUp={scoringMatchUpComplete}
        statusCategories={filteredStatusCategories}
        StatusDisplayFactory={StatusDisplayFactory}
        setMatchUp={setScoringMatchUp}
        closeDialog={closeDialog}
        clearScore={handleClearScore}
        scoreFormatChange={scoreFormatChange}
        save={handleSave}
        closeStatusDialog={closeDialog}
        setInitialMatchUp={setInitialMatchUp}
      />
    </>
  );
};

export default ScoringDialogContainer;
