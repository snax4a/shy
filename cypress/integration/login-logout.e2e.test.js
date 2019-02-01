/// <reference types="Cypress" />

/* globals describe, it, cy, Cypress, expect, beforeEach  */
// import dotenv from 'dotenv';
// dotenv.config();
// console.log(process.env);
//import config from '../../server/config/environment';

const loginLocal = (username, password, expectedUrl) => {
  cy.visit('http://localhost:3000/login');
  cy.get('#email').type(username);
  cy.get('#password').type(password);
  cy.get('#login').click();
  cy.url().should('include', expectedUrl);
};

describe('Login/Logout as Student, Teacher, Admin', () => {
  // it('should login an admin via Google+', () => {
  //   cy.visit('http://localhost:3000/login');
  //   cy.get('#google').click();
  // });

  it('should reject a user with incorrect credentials', () => {
    console.log(Cypress.env('NODE_ENV'));
    loginLocal('bogususer@bitbucket.com', 'knownbadpassword', '/login');
    cy.contains('Unrecognized username/password combination.');
  });

  // it('should login a student with a local account', () => {
  //   loginLocal(config.student.email, config.student.password, '');
  //   cy.get('#logout').click();
  // });

  // it('should login a teacher with a local account', () => {
  //   loginLocal(config.teacher.email, config.teacher.password, '/shynet');
  // });

  // it('should login an admin with a local account', () => {
  //   loginLocal(config.admin.email, config.admin.password, '/admin');
  // });

  // it('should error if a Google user tries to reset their password', () => {
  //   cy.visit('http://localhost:3000/login');
  //   cy.contains('Forgot password?').click();
  //   cy.get('.ng-valid-email').type(config.google.email);
  //   cy.contains('Send Password').click();
  //   cy.contains('Please visit https://myaccount.google.com/security if you forgot your password.');
  // });

  // it('should allow a user to reset their password', () => {
  //   cy.visit('http://localhost:3000/login');
  //   cy.contains('Forgot password?').click();
  //   cy.contains('.ng-valid-email').type(config.student.email);
  // });
});
