import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";


const project_name ='TEST_PROJECT'
Given('Go Home', () => {
    cy.visit('localhost:3000')
})

Given('Session Login', () => {
    // Caching session when logging in via page visit
    const username = 'admin@mw.com'
    const password = 'p4$$'
    cy.session([username,password], () => {
        cy.visit('localhost:3000')
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq','App: Projects List | Mapping Workbench')
    })
})

Then('I expand projects', () => {
    cy.get('#nav_projects').click()
})

When('I click on packages list', () => {
    cy.get("#nav_projects_list").click()
})

Then('I get redirected to projects list page', () => {
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

When('I click on add project button', () => {
    cy.get('#add_button').click()
})


Then('I get redirected to projects create page', () => {
    cy.title().should('eq','App: Project Create | Mapping Workbench')
})


Then('I type project name', () => {
    cy.get('input[name=title]').clear().type(project_name)
})

When('I click create button', () => {
    cy.intercept('POST', 'http://localhost:8000/api/v1/projects',).as('create')
    cy.get('#create_button').click()
})

Then('I get success created', () => {
    cy.wait('@create').its('response.statusCode').should('eq',201)
})

When('I click back to projects link', () => {
    cy.get('#back_to_projects').click()
})

Then('I search for project', () => {
    cy.get('input[type=text]').clear().type(project_name+'{enter}')
})

When('I select project', () => {
    cy.intercept('POST', 'http://localhost:8000/api/v1/users/set_project_for_current_user_session',).as('select')
    cy.get('#select_button').click()
})

Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
})
