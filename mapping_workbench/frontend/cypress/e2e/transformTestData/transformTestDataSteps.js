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

When('I click on transform test data', () => {
    cy.get("#nav_tasks_transform\\ test\\ data").click()
})

Then('I get redirected to transform test data page', () => {
    cy.url().should('include','tasks/transform_test_data') // => true
    cy.title().should('eq','App: Task Transform Test Data | Mapping Workbench')
})

Then('I click on run button', () => {
    cy.intercept('POST', appURLPrefix + 'tasks/transform_test_data',).as('run_test_data')
    cy.get('#run_button').click()
})

Then('I get success transform', () => {
    cy.wait('@run_test_data',{responseTimeout: 999999}).its('response.statusCode').should('eq', 200)
})
