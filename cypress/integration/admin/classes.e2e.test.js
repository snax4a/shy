/// <reference types="Cypress" />

/* globals describe, it, cy, Cypress  */

describe('Admin -> Classes Feature', () => {
  beforeEach(() => {
    cy.loginApi(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'));
    cy.visit('/admin');
    cy.get('#schedule').click();
  });

  it('should create a new class', () => {
    cy.contains('New Schedule Item').click();
    cy.get('#location').select('Squirrel Hill');
    cy.get('#day').select('Sunday');
    cy.get('#startTime').clear()
      .type('18:00');
    cy.get('#endTime').clear()
      .type('19:30');
    cy.get('#title').select('Yoga 1');
    cy.get('#teacher').select('Koontz, Leta');
    cy.get('#canceled').select('No');
    cy.get('#save').click();
  });

  it('should save changes to an existing schedule item', () => {
    cy.contains('tr', 'Leta Koontz').get('td a')
      .first()
      .click();
    cy.get('#location').select('East Liberty');
    cy.get('#canceled').select('Yes');
    cy.get('#save').click();
  });

  it('should delete a schedule item', () => {
    cy.contains('tr', 'Leta Koontz')
      .find('.trash')
      .click();
  });
});
