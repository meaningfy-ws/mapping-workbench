import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, projectName} = Cypress.env()

let sessionProject = ''

Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username,password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq','App: Projects List | Mapping Workbench')
    })
    if(sessionProject) cy.window().then(win => win.sessionStorage.setItem('sessionProject',sessionProject))
})


Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
    cy.window().then(win => sessionProject = win.sessionStorage.getItem('sessionProject'))
})


Then('I expand Tasks', () => {
    cy.get('#nav_tasks').click()
})

Then('I click on SPARQL Queries', () => {
    cy.get('#nav_tasks_sparql\\ queries').click()
})

Then('I get redirected to SPARQL Queries', () => {
    cy.url().should('include','tasks/generate_cm_assertions_queries')
    cy.title().should('eq','App: Task Generate CM Assertions Queries | Mapping Workbench')
})


Then('I click on run button', () => {
    cy.intercept('POST', appURLPrefix + 'tasks/generate_cm_assertions_queries',).as('run_generate_cm_assertions_queries')
    cy.get('#run_button').click()
})

Then('I get success result', () => {
    cy.wait('@run_generate_cm_assertions_queries',{responseTimeout: 999999}).its('response.statusCode').should('eq', 200)
})

