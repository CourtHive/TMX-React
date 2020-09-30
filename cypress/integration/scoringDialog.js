import { changeBestOf, closeEditFormatDialog, setMatchFormat } from '../fixtures/matchFormat';

describe('Score Dialog Tests', () => {
  const saveButton = () => `#sd-save-button`;
  const clearButton = () => `#sd-clear-score`;
  const dataSide = (s) => `[data-side="side${s}"]`;
  const winnerCheck = (s) => `#check-icon-side${s}`;
  const threeDotStatusMenuCheck = (s) => `#more-horizontal-icon-side${s}`;
  const statusSide = (s) => `#more-horizontal-icon-side${s}`;
  const statusCategorySelector = () => `#status-category-selector`;
  const statusCategorySelectorMenu = () => `#status-category-selector-menu`;
  const setResultInputValueDisplay = () => `.tmxInputValueDisplay`;
  const setResultInput = () => `.tmxInput`;
  const setResultTiebreakInput = () => `.tmxInputTiebreak`;
  const openDialog = () => cy.get('button').contains('Open').click();
  const closeDialog = () => cy.get(saveButton()).click();
  const confirmWinner = (s) => cy.get(winnerCheck(s)).children().should('have.length', 1);
  const confirmNoWinner = () => {
    cy.get(threeDotStatusMenuCheck(1)).children().should('have.length', 1);
    cy.get(threeDotStatusMenuCheck(2)).children().should('have.length', 1);
  };
  const deleteValue = (s) => {
    cy.get(dataSide('1')).type('2');
    cy.get(dataSide('2')).type('2');
    cy.get(dataSide('1')).type('2');
    switch (s) {
      case 1:
        cy.get(setResultInputValueDisplay()).first().click();
        cy.get(dataSide('1')).eq(0).type('{backspace}');
        cy.get(setResultInput()).should('have.length', 2);
        cy.get(setResultInputValueDisplay()).should('have.length', 0);
        break;
      case 2:
        cy.get(setResultInputValueDisplay()).eq(1).click();
        cy.get(dataSide('1')).eq(0).type('{backspace}');
        cy.get(setResultInput()).should('have.length', 2);
        cy.get(setResultInputValueDisplay()).should('have.length', 2);
        break;
      case 3:
        cy.get(setResultInputValueDisplay()).eq(2).click();
        cy.get(dataSide('1')).eq(0).type('{backspace}');
        cy.get(setResultInput()).should('have.length', 2);
        cy.get(setResultInputValueDisplay()).should('have.length', 4);
        break;
      case 4:
        cy.get(dataSide('2')).type('2');
        cy.get(setResultInputValueDisplay()).eq(3).click();
        cy.get(dataSide('1')).eq(0).type('{backspace}');
        cy.get(setResultInput()).should('have.length', 2);
        cy.get(setResultInputValueDisplay()).should('have.length', 6);
        break;
      case 5:
        cy.get(dataSide('2')).type('2');
        cy.get(dataSide('1')).type('2');
        cy.get(setResultInputValueDisplay()).eq(4).click();
        cy.get(dataSide('1')).eq(0).type('{backspace}');
        cy.get(setResultInput()).should('have.length', 2);
        cy.get(setResultInputValueDisplay()).should('have.length', 8);
        break;
      default:
        console.log('No set selected');
    }
  };

  const clearScore = () => {
    cy.get(clearButton()).click();
    cy.get(statusSide('1')).children().should('have.length', 1);
    cy.get(statusSide('2')).children().should('have.length', 1);
  };

  // Standard Advantage (default)
  it('Can load', () => cy.visit(`http://localhost:3000/test`));
  it('Can Open Dialog', () => openDialog());
  it('can enter loser scores side2', () => {
    cy.get(dataSide('2')).type('2');
    cy.get(dataSide('2')).type('2');
  });
  it('can confirm winner side 1', () => confirmWinner(1));
  it('can clear score', () => clearScore());

  it('can enter loser scores side1', () => {
    cy.get(dataSide('1')).type('2');
    cy.get(dataSide('1')).type('2');
  });
  it('can confirm winner side 2', () => confirmWinner(2));
  it('can display final set input when 1-1', () => {
    clearScore();
    cy.get(dataSide('1')).type('2');
    cy.get(dataSide('2')).type('2');
    cy.get(setResultInputValueDisplay()).should('have.length', 4);
    cy.get(setResultInput()).should('have.length', 2);
  });
  it('can display tiebreak input when 1-1 and last last set goes to tiebreak', () => {
    clearScore();
    cy.get(dataSide('1')).type('2');
    cy.get(dataSide('2')).type('2');
    cy.get(dataSide('1')).type('6');
    cy.get(setResultTiebreakInput()).should('have.length', 2);
  });
  it('Can delete value from first set', () => {
    clearScore();
    deleteValue(1);
  });
  // Click on `space` should do nothing
  it(`Can't enter {space}`, () => {
    clearScore();
    cy.get(dataSide('1')).type('{backspace}');
    cy.get(setResultInput()).should('have.length', 2);
  });
  // ------------------------------------------------------------------------
  // Change `bestOfWhat` (number of sets) to 1 => should change `best of` to `exact`
  setMatchFormat('Custom');
  changeBestOf(1);
  closeEditFormatDialog();
  it(`Changes set values to 1 when 'best of' is changed to 'exactly`, () => {
    cy.get('#ut-exact-selector').should('contain.text', 'Exactly');
  });
  setMatchFormat('Custom');
  changeBestOf(3);
  closeEditFormatDialog();
  // ------------------------------------------------------------------------

  // Edit standard
  it('Can confirm NO winner after edit of final set from 6->5', () => {
    clearScore();
    cy.get(dataSide('2')).type('2');
    cy.get(dataSide('2')).type('2');
    cy.get(setResultInputValueDisplay()).eq(1).click();
    cy.get(dataSide('1')).eq(0).type('5');
    confirmNoWinner();
  });
  // ------------------------------------------------------------------------
  // Backspace functionality
  it('Can delete value from first set then complete the score with side1 winner', () => {
    clearScore();
    deleteValue(1);
    cy.get(dataSide('2')).type('2');
    cy.get(dataSide('2')).type('2');
    confirmWinner(1);
  });
  it('Can delete value from second set', () => {
    clearScore();
    deleteValue(2);
  });
  it('Can delete value from third set', () => {
    clearScore();
    deleteValue(3);
  });
  setMatchFormat('Custom');
  changeBestOf(5);
  closeEditFormatDialog();
  it('Can delete value from fourth set', () => {
    clearScore();
    deleteValue(4);
  });
  it('Can delete value from fifth set', () => {
    clearScore();
    deleteValue(5);
  });
  // ------------------------------------------------------------------------
  // Statuses
  it(`Can't change status to 'Retirements' if there's no score`, () => {
    clearScore();
    cy.get(statusSide('1')).click();
    cy.get(statusCategorySelector()).click();
    cy.get(statusCategorySelectorMenu()).children().should('not.contain.text', 'Retirements');
    cy.get(statusCategorySelectorMenu()).children().first().click();
    cy.get('#status-dialog-close').click();
  });
  // ------------------------------------------------------------------------
  // USTA default configurations
  // SET3-S:6/TB7 - this one is already covered, it's standard advantage

  // SET3-S:6/TB7-F:TB10 - this is ATP Doubles format
  // in ATP doubles final set is played as tiebreak
  setMatchFormat('ATP Doubles');
  closeEditFormatDialog();
  it('Can enter tiebreak scores', () => {
    clearScore();
    cy.get(dataSide('2')).type('6');
    cy.get(dataSide('2')).last().type('6');
    // cy.get(dataSide('2')).last().type('{enter}'); // pressing 'Enter' currently does nothing
    cy.wait(1100);
    cy.get(dataSide('1')).last().type('6');
    cy.get(dataSide('1')).last().type('6');
    cy.wait(1100);
    cy.get(dataSide('1')).last().type('{enter}');
    cy.get(dataSide('1')).last().type('5');
    confirmWinner(2);
    closeDialog();
  });

  it('SET3-S:6/TB7-F:TB10 (ATP Doubles) - can enter final set as a tiebreak score', () => {
    openDialog();
    clearScore();
    cy.get(dataSide('1')).type('2');
    cy.get(dataSide('2')).type('2');
    cy.get(dataSide('2')).last().type('7');
    confirmWinner(1);

    clearScore();
    cy.get(dataSide('1')).type('2');
    cy.get(dataSide('2')).type('2');
    cy.get(dataSide('2')).last().type('{shift}7');
    confirmWinner(2);

    clearScore();
    cy.get(dataSide('1')).type('2');
    cy.get(dataSide('2')).type('2');
    cy.get(dataSide('1')).last().type('7');
    confirmWinner(2);
  });
  it('SET3-S:6/TB7-F:TB10 (ATP Doubles) - can enter more than 2 digit tiebreak', () => {
    clearScore();
    cy.get(dataSide('2')).type('6');
    cy.get(dataSide('2')).last().type('6');
    cy.get(dataSide('2')).last().type('6');
    cy.get(dataSide('2')).last().type('6');
    cy.wait(1100);
    cy.get(setResultInput()).should('have.length', 2);
    cy.get(setResultInputValueDisplay()).should('have.length', 2);
  });
  it('SET3-S:6/TB7-F:TB10 (ATP Doubles) - Entering tiebreak in 1st set does not change status to winner', () => {
    clearScore();
    cy.get(dataSide('2')).type('6');
    cy.get(dataSide('2')).last().type('6');
    confirmNoWinner();
  });
  // ------------------------------------------------------------------------

  // it('SET3-S:6/TB7-F:TB10 (ATP Doubles) - can retire one side', () => {
  //   clearScore();
  //   cy.get(dataSide('2')).type('6');
  //
  // });
});
