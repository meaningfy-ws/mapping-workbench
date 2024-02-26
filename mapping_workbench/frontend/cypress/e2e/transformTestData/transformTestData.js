import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const username = 'admin@mw.com'
const password = 'p4$$'
const projectName = 'TEST_PROJECT'
let sessionProject = ''


Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username,password], () => {
        cy.visit('localhost:3000')
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq','App: Projects List | Mapping Workbench')
    })
    if(sessionProject) cy.window().then(win => win.sessionStorage.setItem('sessionProject',sessionProject))
})

Given('Go Home', () => {
    cy.visit('localhost:3000')
})

Then('I get redirected to projects list page', () => {
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

Then('I search for project', () => {
    cy.get('input[type=text]').clear().type(projectName+'{enter}')
})

When('I select project', () => {
    cy.intercept('POST', 'http://localhost:8000/api/v1/users/set_project_for_current_user_session',).as('select')
    cy.get('#select_button').click()
})

Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
    cy.window().then(win => sessionProject = win.sessionStorage.getItem('sessionProject'))
})

Then('I expand tasks', () => {
    cy.get('#nav_tasks').click()
})

When('I click on transform test data', () => {
    cy.get("#nav_tasks_transform\\ test\\ data").click()
})

Then('I get redirected to transform test data page', () => {
    cy.url().should('include','tasks/transform_test_data') // => true
})

Then('I click on run button', () => {
    cy.intercept('POST', 'http://localhost:8000/api/v1/tasks/transform_test_data',).as('run_test_data')
    cy.get('#run_button').click()
})

Then('I get success transform', () => {
    cy.wait('@run_test_data',{responseTimeout: 999999}).its('response.statusCode').should('eq', 200)
})
