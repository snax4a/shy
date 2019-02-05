/// <reference types="Cypress" />

/* globals describe, it, cy, Cypress  */

describe('Admin -> Announcements Feature', () => {
  beforeEach(() => {
    cy.loginApi(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'));
    cy.visit('/admin');
    cy.get('#announcements').click();
  });

  it('should create a new announcement', () => {
    cy.contains('New Announcement').click();
    cy.get('#section').clear()
      .type('Section Test');
    cy.get('#title').clear()
      .type('Title Test');
    cy.get('#description').clear()
      .type('Description Test');
    cy.get('#save').click();
  });

  it('should save changes to an existing announcement', () => {
    cy.contains('Section Test').click();
    cy.get('#section').clear()
      .type('Section Test Changed');
    cy.get('#title').clear()
      .type('Title Test Changed');
    cy.get('#description').clear()
      .type('Description Test Changed');
    cy.get('#save').click();
  });

  it('should delete an announcement', () => {
    cy.contains('tr', 'Section Test Changed')
      .find('.trash')
      .click();
  });
});
