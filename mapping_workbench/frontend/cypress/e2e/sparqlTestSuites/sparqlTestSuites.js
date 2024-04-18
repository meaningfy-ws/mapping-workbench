import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'


const {username, password, homeURL, appURLPrefix, projectName} = Cypress.env()

const sparql_suite_name = 'test_suite'
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

Given('Go Home', () => {
    cy.visit(homeURL)
})

Then('I get redirected to projects list page', () => {
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

Then('I search for project', () => {
    cy.get('input[type=text]').clear().type(projectName+'{enter}')
})

When('I select project', () => {
    cy.intercept('POST', appURLPrefix + 'users/set_project_for_current_user_session',).as('select')
    cy.get('#select_button').click()
})

Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
    cy.window().then(win => sessionProject = win.sessionStorage.getItem('sessionProject'))
})

//add sparql test suite

Then('I click on Sparql Test Suites', () => {
    cy.intercept('GET', appURLPrefix + 'sparql_test_suites*').as('get')
    cy.get('#nav_sparql\\ test\\ suites').click()
})

Then('I get redirected to Sparql Test Suites', () => {
    cy.url().should('include','sparql-test-suites')
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click on add button', () => {
    cy.get('#add_button').click()
})

Then('I get redirected to create page', () => {
    cy.url().should('include','sparql-test-suites/create') // => true
})


Then('I enter name', () => {
    cy.intercept('POST', appURLPrefix + "shacl_test_suites").as('create')
    cy.get("input[name=title]").clear().type(sparql_suite_name)
    cy.get("button[type=submit]").click()
})


Then('I successfully create suite', () => {
    cy.wait('@create').its('response.statusCode').should('eq', 201)
})

// update

Then('I search for suite', () => {
    cy.get('input[type=text]').clear().type(sparql_suite_name+'{enter}')
})

Then('I receive suite', () => {
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click edit button', () => {
    cy.get('#edit_button').click()
})

Then('I get redirected to edit page', () => {
    cy.url().should('include','/edit') // => true
})

Then('I enter updated name', () => {
    cy.intercept('PATCH', appURLPrefix + 'shacl_test_suites/*').as('update')
    cy.get("input[name=title]").clear().type(sparql_suite_name + 1 +'{enter}')
})

Then('I get success update', () => {
    cy.wait('@update').its('response.statusCode').should('eq', 200)
})

Then('I search for updated suite', () => {
    cy.get('input[type=text]').clear().type(sparql_suite_name + 1 + '{enter}')
})

Then('I click delete button', () => {
    cy.intercept('DELETE',appURLPrefix + 'sparql_test_suites/*').as('delete')
    cy.get('#delete_button').click()
    cy.get('#yes_dialog_button').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})
