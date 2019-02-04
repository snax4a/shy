// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
/// <reference types="Cypress" />

/* globals cy, Cypress  */
// -- This is a parent command --
Cypress.Commands.add('login', (email, password, expectedUrl) => { 
  cy.visit('/login');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('#login').click();
  cy.location('pathname').should('eq', expectedUrl);
});

Cypress.Commands.add('logout', () => {
  cy.get('#username').click();
  cy.get('#logout').click();
});

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
