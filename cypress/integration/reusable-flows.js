/// <reference types="Cypress" />

/* globals describe, cy  */

export const loginLocal = (username, password, expectedUrl) => {
  cy.visit('/login');
  cy.get('#email').type(username);
  cy.get('#password').type(password);
  cy.get('#login').click();
  cy.url().should('include', expectedUrl);
};

export const logout = () => {
  cy.get('#username').click();
  cy.get('#logout').click();
};
