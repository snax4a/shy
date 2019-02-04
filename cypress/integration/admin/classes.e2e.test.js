/// <reference types="Cypress" />

/* globals describe, it, cy, Cypress  */

describe('Admin -> Classes Feature', () => {
  it('should login admin and navigate to Announcements tab', () => {
    cy.login(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'), '/admin');
    cy.get('#schedule').click();
  });

  it('should create a new class', () => {
    cy.contains('New Schedule Item').click();
    cy.get('#location').select('Squirrel Hill');
    cy.get('#day').select('Sunday');
    cy.get('#startTime').type('18:00');
    cy.get('#endTime').type('19:30');
    cy.get('#title').select('Yoga 1');
    cy.get('#teacher').select('Koontz, Leta');
    cy.get('#canceled').select('No');
    cy.get('#save').click();
  });

  // it('should save changes to an existing schedule item', () => {
  //   cy.contains('Section Test').click();
  //   cy.get('#section').type('Section Test Changed');
  //   cy.get('#title').type('Title Test Changed');
  //   cy.get('#description').type('Description Test Changed');
  //   cy.get('#save').click();
  // });

  // it('should delete a schedule item', () => {
  //   //cy.logout();
  // });
});
