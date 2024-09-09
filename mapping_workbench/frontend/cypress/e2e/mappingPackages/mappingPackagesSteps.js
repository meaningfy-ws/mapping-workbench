import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, packageFile} = Cypress.env()
const testPacakgeName = 'test_package'


Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username,password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq','Mapping Workbench')
    })
})

Given('I go to Mapping Packages', () => {
    cy.get('#nav_mapping_packages').click()
})

Then('I get redirected to Mapping Packages list page', () => {
    cy.intercept('GET', appURLPrefix + 'mapping_packages*',).as('getPackages')
    cy.title().should('eq','App: Mapping Packages List | Mapping Workbench')
})

Then('I receive Mapping Packages', () => {
    cy.wait('@getPackages').its('response.statusCode').should('eq',200)
})

When('I expand first package details', () => {
    cy.get('#expand_button').click()
})


When('I click on add Mapping Packages button', () => {
    cy.get("#add_package_button").click()
})

Then('I get redirected to Mapping Packages create page', () => {
    cy.title().should('eq','App: Mapping Package Create | Mapping Workbench')
})

When('I click on Mapping Packages import', () => {
    cy.get("#import_package_button").click()
})

Then("I click select file", () => {
    cy.get('.MuiBox-root > input').selectFile(packageFile, { force: true })
})

Then('I click on import button', () => {
    cy.get('#import_button').click()
})

Then('I click on upload button', () => {
    cy.intercept('POST', appURLPrefix + 'package_importer/tasks/import*',).as('upload')
    cy.get('#upload_button').click()
})

Then('I get success upload', () => {
    cy.wait('@upload').its('response.statusCode').should('eq',201)
})

Then('I enter name and id', () => {
    cy.get('input[name=title]').clear().type(testPacakgeName)
    cy.get('input[name=identifier]').clear().type(testPacakgeName)
})

Then('I click on submit button', () => {
    cy.intercept('POST', appURLPrefix + 'mapping_packages',).as('create')
    cy.get('button[type=submit]').click()
})

Then('I get success create', () => {
    cy.wait('@create')
})

Then('I search for Mapping Package', () => {
    cy.get('input[type=text]').clear().type(testPacakgeName+'{enter}')
})

When('I edit Mapping Package', () => {
    cy.get('#edit_button').click()
})

Then('I update name', () => {
    cy.intercept('PATCH',appURLPrefix + 'mapping_packages/*').as('update')
    cy.get('input[name=title]').clear().type(testPacakgeName + 1)
})

Then('I get success update', () => {
    cy.wait('@update')
})

Then('I search for updated Mapping Package', () => {
    cy.get('input[type=text]').clear().type(testPacakgeName + 1 +'{enter}')
})

When('I delete Mapping Package', () => {
    cy.intercept('DELETE',appURLPrefix + 'mapping_packages/*').as('delete')
    cy.get('#delete_button').click()
})

Then('I click yes', () => {
    cy.get('#yes_dialog_button').click()
})
Then('I get success delete', () => {
    cy.wait('@delete')
})
