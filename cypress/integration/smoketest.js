import { hashId } from '../../src/functions/strings';
import { it } from 'date-fns/locale';

describe('smoketest', () => {
  const clickIdTarget = (id) => cy.get(`#${id}`).click();
  // const clickButtonContains = (content) => cy.get('button').get(`[title="${content}"]`).click();
  const openMainMenu = () => clickIdTarget('tmxNav');

  const timestring = new Date().getTime().toString();
  const id = hashId(timestring);
  const tournamentName = `Smoke Test ${id}`;
  const testEvent = 'Test Event';
  const testDraw = 'Test Draw';

  it('Can Reset', () => {
    cy.visit('http://localhost:3000?actionKey=reset');
    cy.wait(500);
    clickIdTarget('okButton');
  });
  it('Can load', () => cy.visit(`http://localhost:3000`));
  it('Can Open Main Menu', () => openMainMenu());
  it('Can navigate to tournaments', () => clickIdTarget('mm-tournaments'));

  it('Can add and navigate to a new tournament', () => {
    clickIdTarget('addTournament');
    cy.get(`#customTournamentName`).clear().type(tournamentName);
    clickIdTarget('submitNewTournament');
    cy.get(`[value="${tournamentName}"]`).click();
  });

  it('Can add players', () => {
    clickIdTarget('tab-participants');
    clickIdTarget('editParticipants');
    clickIdTarget('syncParticipants');
    clickIdTarget('synchronizePlayers');
    cy.get('input').get('[type="checkbox"]').first().click();
    clickIdTarget('modifySignInState');
  });

  it('can add an event', () => {
    clickIdTarget('tab-events');
    clickIdTarget('editEvents');
    clickIdTarget('addEvent');
    cy.get(`#eventName`).clear().type(testEvent);
    clickIdTarget('submitNewEvent');
  });
  it('can add players to an event', () => {
    cy.get('td').get(`[value="${testEvent}"]`).first().click();
    clickIdTarget('editEventParticipants');
    clickIdTarget('addEventParticipants');
    cy.get('input').get('[type="checkbox"]').first().click();
    clickIdTarget('addSelectedParticipants');
  });
  it('can add a new Draw', () => {
    clickIdTarget('editDraws');
    clickIdTarget('addNewDraw');
    cy.get(`#customDrawName`).clear().type(testDraw);
    clickIdTarget('submitNewDraw');
    cy.get(`[value="${testDraw}"]`).click();
  });

  it('can enter scores', () => {
    clickIdTarget('tab-draws');
    cy.get('.readyToScore').first().click();
    clickIdTarget('scoreMatchUp');
  });

  it('can access the tournament record', () => {
    cy.window().then((win) => {
      const tournamentRecords = win.dev.tmxStore.getState().tmx.records;
      console.log({ tournamentRecords });
    });
  });
});
