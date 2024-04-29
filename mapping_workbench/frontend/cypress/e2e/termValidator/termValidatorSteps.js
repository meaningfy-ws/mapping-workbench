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

Then('I click on Term Validator', () => {
    cy.get('#nav_tasks_terms\\ validator').click()
})

Then('I get redirected to Term Validator', () => {
    cy.url().should('include','terms_validator')
    cy.title().should('eq','App: Task Terms Validator | Mapping Workbench')
})


Then('I click on run button', () => {
    cy.intercept('POST', appURLPrefix + 'tasks/terms_validator',).as('run_terms_validator')
    cy.get('#run_button').click()
})

Then('I get success result', () => {
    cy.wait('@run_terms_validator',{responseTimeout: 999999}).its('response.statusCode').should('eq', 200)
})

