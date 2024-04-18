import {Given} from "cypress-cucumber-preprocessor/steps";

const {homeURL} = Cypress.env();
Given('Go Home', () => {
    cy.visit(homeURL)
})

