export function canLoad() {
  it('Can load', () => cy.visit('http://localhost:3000/test'));
}
export function setMatchFormat(format) {
  const presentation = () => `[role="presentation"]`;
  it('Can find Scoring component', () => {
    cy.get('#sd-edit-score-format').click();
    cy.get('label')
      .contains('Scoring')
      .then(($scoring) => {
        cy.wrap($scoring).parent().find('li').first().click();
      });
    cy.get(presentation()).then(($prez) => {
      cy.wrap($prez).find('li').contains(format).click();
    });
  });
}
export function closeEditFormatDialog() {
  it('Can close edit format dialog', () => {
    cy.get('#close-edit-format-dialog').click();
  });
}

export function changeExact(value) {
  it('Can set exact', () => {
    cy.get('#ut-exact-selector').click();
    cy.get(`[data-test-id=${value}]`).click();
  });
}
export function changeBestOf(value) {
  it('Can set bestOf', () => {
    cy.get('#ut-best-of-selector').click();
    cy.get(`[data-test-id=${value}]`).click();
  });
}
export function changeBestOfWhat(value) {
  it('Can set best of what (sets, tiebreaks, timed set)', () => {
    cy.get('#ut-best-of-what-selector').click();
    cy.get(`[data-test-id=${value}]`).click();
  });
}