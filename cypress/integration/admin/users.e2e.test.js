/// <reference types="Cypress" />

/* globals describe, it, cy, Cypress  */

const find = email => {
  cy.get('#filterField')
    .clear()
    .type(email);
  cy.get('#search').click();
  cy.contains(email);
};

describe('Admin -> Users Feature', () => {
  beforeEach(() => {
    cy.loginApi(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'));
    cy.visit('/admin');
  });


  it('should find existing user', () => {
    find(Cypress.env('ADMIN_EMAIL'));
  });

  it('should get no results when searching for user who does not exist', () => {
    cy.get('#filterField')
      .clear()
      .type('no_one_who_exists');
    cy.get('#search').click();
    cy.contains('tr', 'No users found meeting the search criteria.');
  });

  it('should error when creating new user if required fields are empty or invalid', () => {
    cy.contains('New User').click();
    cy.get('#save').click();
    cy.contains('Please enter the first name.');
    cy.contains('Please enter the last name.');
    cy.contains('Please enter the email address.');
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
    find('testy.mctestface@bitbucket.com');
    cy.contains('Mctestface, Testy').click();
    cy.get('#email').clear()
      .type('testy.mctestface@bitbucket.com');
    cy.get('#role').select('Administrator');
    cy.get('#save').click();
  });

  it('should delete a user', () => {
    find('testy.mctestface@bitbucket.com');
    cy.contains('tr', 'Mctestface, Testy')
      .find('.trash')
      .click();
  });
});
