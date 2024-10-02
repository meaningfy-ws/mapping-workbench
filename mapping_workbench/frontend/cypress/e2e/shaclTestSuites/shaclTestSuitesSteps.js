import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, projectName, homePageLabel} = Cypress.env()

const shacl_suite_name = 'test_suite'
let sessionProject = ''

Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username,password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq',homePageLabel)
    })
    if(sessionProject) cy.window().then(win => win.sessionStorage.setItem('sessionProject',sessionProject))
})


Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
    cy.window().then(win => sessionProject = win.sessionStorage.getItem('sessionProject'))
})

//add shacl test suite

Then('I click on Shacl Test Suites', () => {
    cy.intercept('GET', appURLPrefix + 'shacl_test_suites*').as('get')
    cy.get('#nav_quality_control').click()
    cy.get('#nav_shacl_test_suites').click()
})

Then('I get redirected to Shacl Test Suites', () => {
    cy.url().should('include','shacl-test-suites')
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click on add button', () => {
    cy.get('#add_button').click()
})

Then('I get redirected to create page', () => {
    cy.url().should('include','shacl-test-suites/create') // => true
})


Then('I enter name', () => {
    cy.intercept('POST', appURLPrefix + "shacl_test_suites").as('create')
    cy.get("input[name=title]").clear().type(shacl_suite_name)
    cy.get("button[type=submit]").click('right')
})


Then('I successfully create suite', () => {
    cy.wait('@create').its('response.statusCode').should('eq', 201)
})

// update

Then('I search for suite', () => {
    cy.get('input[type=text]').clear().type(shacl_suite_name+'{enter}')
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
    cy.get("input[name=title]").clear().type(shacl_suite_name + 1 +'{enter}')
})

Then('I get success update', () => {
    cy.wait('@update').its('response.statusCode').should('eq', 200)
})

Then('I search for updated suite', () => {
    cy.get('input[type=text]').clear().type(shacl_suite_name+1+'{enter}')
})

Then('I click delete button', () => {
    cy.intercept('DELETE',appURLPrefix + 'shacl_test_suites/*').as('delete')
    cy.get('#delete_button').click()
    cy.get('#yes_dialog_button').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})
