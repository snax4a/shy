/// <reference types="Cypress" />

/* globals describe, it, cy, Cypress  */

describe('Admin -> Users Feature', () => {
  beforeEach(() => {
    cy.loginApi(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'));
    cy.visit('/admin');
  });

  it('should create a new student', () => {
    cy.contains('New User').click();
    cy.get('#firstName')
      .clear()
      .type('Testy');
    cy.get('#lastName')
      .clear()
      .type('McTestface');
    cy.get('#email')
      .clear()
      .type('testy.mctestface@bitbucket.com');
    cy.get('#phone')
      .clear()
      .type('412-555-1212');
    cy.get('#save').click();
  });

  it('should save changes to an existing student', () => {
    cy.get('#filterField')
      .clear()
      .type('testy.mctestface@bitbucket.com');
    cy.get('#search').click();
    cy.contains('Mctestface, Testy').click();
    cy.get('#email').clear()
      .type('testy.mctestface@bitbucket.com');
    cy.get('#role').select('Administrator');
    cy.get('#save').click();
  });

  it('should delete a user', () => {
    cy.get('#filterField')
      .clear()
      .type('testy.mctestface@bitbucket.com');
    cy.get('#search').click();
    cy.contains('tr', 'Mctestface, Testy')
      .find('.trash')
      .click();
  });
});
