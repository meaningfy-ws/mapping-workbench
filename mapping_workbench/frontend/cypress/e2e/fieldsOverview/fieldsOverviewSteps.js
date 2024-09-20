import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, projectName, gitUrl, branchVersion} = Cypress.env()
let sessionProject = ''

Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username,password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq','Mapping Workbench')
    })
    if(sessionProject) cy.window().then(win => win.sessionStorage.setItem('sessionProject',sessionProject))
})


Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
    cy.window().then(win => sessionProject = win.sessionStorage.getItem('sessionProject'))
    cy.log('sessionProject',sessionProject)
})

Then('Check home title', () => {
    cy.title().should('eq','Mapping Workbench')
})

Given('I click on Fields Overview', () => {
    cy.intercept('GET', appURLPrefix + 'fields_registry/elements*',).as('getFields')
    cy.get('#nav_fields_\\&_nodes').click()
    cy.get(':nth-child(2) > #nav_overview').click()
})


When('I click on import schema button', () => {
    cy.get('#import_shema_button').click()
})

Then('I get redirected to field registry import page', () => {
    cy.url().should('include','fields-and-nodes/overview/import')
})

Then('I type git url', () => {
    cy.get("input[name=github_repository_url]").clear().type(gitUrl)
})


Then('I type branch name', () => {
    cy.get("input[name=branch_or_tag_name]").clear().type(branchVersion)
})

When('I click on import button', () => {
    cy.intercept('POST', appURLPrefix + 'fields_registry/tasks/import_eforms_from_github',).as('import')
    cy.get('#import').click()
})

Then('I get success import', () => {
    cy.wait('@import',{responseTimeout: 999999}).its('response.statusCode').should('eq', 201)
})


Then('I get redirected to Fields Overview', () => {
    cy.url().should('include','fields-and-nodes/overview')
})

And('I receive fields', () => {
    cy.wait('@getFields')
})

Then('I click on view button', () => {
    cy.get('#view_button').click()
})

When('I get redirected to view page', () => {
    cy.url().should('include','/view')
})