/// <reference types="Cypress" />

/* globals describe, it, cy, Cypress, expect, beforeEach  */

import * as shy from './reusable-flows';

describe('Admin -> Announcements Feature', () => {
  it('should login admin and navigate to Announcements tab', () => {
    shy.loginLocal(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'), '/admin');
    cy.get('#announcements').click();
  });

  it('should create a new announcement', () => {
    cy.contains('New Announcement').click();
    cy.get('#section').type('Section Test');
    cy.get('#title').type('Title Test');
    cy.get('#description').type('Description Test');
    cy.get('#save').click();
  });

  // it('should save changes to an existing announcement', () => {
  //   cy.contains('Section Test').click();
  //   cy.get('#section').type('Section Test Changed');
  //   cy.get('#title').type('Title Test Changed');
  //   cy.get('#description').type('Description Test Changed');
  //   cy.get('#save').click();
  // });

  // it('should delete an announcement', () => {
  //   //shy.logout();
  // });
});
