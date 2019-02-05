/// <reference types="Cypress" />

/* globals cy, Cypress  */

Cypress.Commands.add('login', (email, password, expectedUrl) => {
  cy.visit('/login');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('#login').click();
  cy.location('pathname').should('eq', expectedUrl);
});

// Do the login via API only
Cypress.Commands.add('loginApi', (email, password) => {
  cy.request('POST', '/auth/local', { email, password })
    .then(response => {
      cy.setCookie('token', response.body.token);
    });
});

Cypress.Commands.add('logout', () => {
  cy.get('#username').click();
  cy.get('#logout').click();
});

