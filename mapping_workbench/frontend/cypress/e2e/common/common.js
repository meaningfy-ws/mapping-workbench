import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";

const {homeURL, appURLPrefix, projectName} = Cypress.env();
Given('Go Home', () => {
    cy.visit(homeURL)
})

Then('I click on projects', () => {
    cy.get('#nav_projects').click()
})

Then('I get redirected to projects list page', () => {
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

Then('I search for project', () => {
    cy.get('input[type=text]').clear().type(projectName + '{enter}')
})

When('I select project', () => {
    cy.intercept('POST', appURLPrefix + 'users/set_project_for_current_user_session',).as('select')
    cy.get('#select_button').click()
})


Then('I expand tasks', () => {
    cy.get('#nav_tasks').click()
})