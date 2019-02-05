/// <reference types="Cypress" />

/* globals describe, it, cy, Cypress  */

describe('Admin -> Users Feature', () => {
  beforeEach(() => {
    cy.loginApi(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'));
    cy.visit('/admin');
    cy.get('#users').click();
  });

  it('should create a new user', () => {
    cy.contains('New User').click();
    cy.get('#section').type('Section Test');
    cy.get('#title').type('Title Test');
    cy.get('#description').type('Description Test');
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
