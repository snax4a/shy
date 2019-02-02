/// <reference types="Cypress" />

/* globals describe, it, cy, Cypress, expect, beforeEach  */

import * as shy from './reusable-flows';

describe('Login/Logout Feature as Student, Teacher, Admin', () => {
  // Not working due to CORS issue with Google redirect
  // it('should login an admin via Google+', () => {
  //   cy.visit('/login');
  //   cy.get('#google').click();
  // });

  it('should reject a user with incorrect credentials', () => {
    shy.loginLocal('bogususer@bitbucket.com', 'knownbadpassword', '/login');
    cy.contains('Unrecognized username/password combination.');
  });

  it('should login a student with a local account', () => {
    shy.loginLocal(Cypress.env('STUDENT_EMAIL'), Cypress.env('STUDENT_PASSWORD'), '/');
    shy.logout();
  });

  it('should login a teacher with a local account', () => {
    shy.loginLocal(Cypress.env('TEACHER_EMAIL'), Cypress.env('TEACHER_PASSWORD'), '/shynet');
    shy.logout();
  });

  it('should login an admin with a local account', () => {
    shy.loginLocal(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'), '/admin');
    shy.logout();
  });

  it('should error if a Google user tries to reset their password', () => {
    cy.visit('/login');
    cy.get('#forgotPassword').click();
    cy.get('#email').type(Cypress.env('GOOGLE_EMAIL'));
    cy.get('#sendPassword').click();
    cy.contains('Please visit https://myaccount.google.com/security if you forgot your password.');
    cy.get('#cancel').click();
  });

  it('should allow a user to reset their password', () => {
    cy.visit('/login');
    cy.get('#forgotPassword').click();
    cy.get('#email').type(Cypress.env('STUDENT_EMAIL'));
    cy.get('#sendPassword').click();
    cy.contains('A new password was emailed to you. Please check your Junk folder if you don\'t see it.');
    shy.loginLocal(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'), '/admin');
    cy.get('#filterField').type(Cypress.env('STUDENT_EMAIL'));
    cy.get('#search').click();
    cy.get('#edit').click();
    cy.get('#passwordNew').type(Cypress.env('STUDENT_PASSWORD'));
    cy.get('#passwordConfirm').type(Cypress.env('STUDENT_PASSWORD'));
    cy.get('#save').click();
    shy.logout();
  });
});