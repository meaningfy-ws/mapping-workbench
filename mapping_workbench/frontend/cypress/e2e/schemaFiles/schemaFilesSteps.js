import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, projectName} = Cypress.env()
const schema_file_name = 'test_schema_file'
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


Then('I click on Schema Files', () => {
    cy.intercept('GET', appURLPrefix + 'xsd_schema/xsd_files*').as('get')
    cy.get('#nav_schema_files').click()
})

Then('I get redirected to Schema Files', () => {
    cy.url().should('include','schema-files')
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

//upload schema file
Then('I click on upload button', () => {
    cy.get('#import_button').click()
})

Then('I select file to upload', () => {
    cy.get('.MuiBox-root > input').selectFile(schema_file_name+'.xsd', { force: true })
})

Then('I click on ok upload button', () => {
    cy.intercept('POST', appURLPrefix + 'xsd_schema/xsd_files*').as('upload')
    cy.get('#upload_button').click()
})

Then('I get success upload', () => {
    cy.wait('@upload').its('response.statusCode').should('eq',201)
})

//DELETE
Then('I search for Schema Files', () => {
    cy.get('input[type=text]').clear().type(schema_file_name+'{enter}')
})

Then('I click delete button', () => {
    cy.intercept('DELETE',appURLPrefix + 'xsd_schema/xsd_files/' + schema_file_name +'.xsd*').as('delete')
    cy.get('#menu_button').click()
    cy.get('#delete_menu_item').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})
