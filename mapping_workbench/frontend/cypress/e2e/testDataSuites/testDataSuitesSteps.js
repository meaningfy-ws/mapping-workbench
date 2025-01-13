import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, projectName, homePageLabel} = Cypress.env()

const test_suite_name = 'test_suite'
let sessionProject = ''

Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username,password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq', homePageLabel)
    })
    if(sessionProject) cy.window().then(win => win.sessionStorage.setItem('sessionProject',sessionProject))
})

Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
    cy.window().then(win => sessionProject = win.sessionStorage.getItem('sessionProject'))
})

Then('I go to Test Data Suites page', () => {
    cy.intercept('GET', appURLPrefix + 'test_data_suites*').as('get')
    cy.get('#source_and_target').click()
    cy.get('#source_files_tab').click()
})

Then('I get redirected to test data suites', () => {
    cy.url().should('include','test-data-suites')
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

When('I click on transform test data', () => {
    cy.get("#transform-test-data_button").click()
})

Then('I get redirected to transform test data page', () => {
    cy.url().should('include','tasks/transform-test-data') // => true
})

Then('I click on run button', () => {
    cy.intercept('POST', appURLPrefix + 'test_data_suites/tasks/transform_test_data',).as('run_test_data')
    cy.get('#run_button').click()
})

Then('I get success transform', () => {
    cy.wait('@run_test_data',{responseTimeout: 999999}).its('response.statusCode').should('eq', 201)
})

Then('I click on add button', () => {
    cy.get('#add_button').click()
})

Then('I get redirected to create test data page', () => {
    cy.url().should('include','test-data-suites/create') // => true
})

// Then('I get mapping_packages', ())


Then('I enter test data name', () => {
    cy.intercept('POST', appURLPrefix + "test_data_suites").as('create')
    cy.get("input[name=title]").clear().type(test_suite_name)
    cy.get("button[type=submit]").click('right')
})


Then('I successfully create suite', () => {
    cy.wait('@create').its('response.statusCode').should('eq', 201)
})


Then('I search for suite', () => {
    cy.get('input[type=text]').clear().type(test_suite_name+'{enter}')
})

Then('I receive suite', () => {
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})


Then('I click view button', () => {
    cy.get('#view_button').click()
})

Then('I click edit button', () => {
    cy.get('#edit_button').click()
})

Then('I get redirected to edit page', () => {
    cy.url().should('include','/edit') // => true
})

Then('I enter updated name', () => {
    cy.intercept('PATCH', appURLPrefix + 'test_data_suites/*').as('update')
    cy.get("input[name=title]").clear().type(test_suite_name + 1 +'{enter}')
})

Then('I get success update', () => {
    cy.wait('@update').its('response.statusCode').should('eq', 200)
})

Then('I search for updated suite', () => {
    cy.get('input[type=text]').clear().type(test_suite_name + 1 + '{enter}')
})

Then('I click delete button', () => {
    cy.intercept('DELETE',appURLPrefix + 'test_data_suites/*').as('delete')
    cy.get('#delete_button').click()
    cy.get('#yes_dialog_button').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})
