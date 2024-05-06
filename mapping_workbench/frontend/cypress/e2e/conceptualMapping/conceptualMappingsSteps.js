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
        cy.title().should('eq','App: Projects List | Mapping Workbench')
    })
    if(sessionProject) cy.window().then(win => win.sessionStorage.setItem('sessionProject',sessionProject))
})


Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
    cy.window().then(win => sessionProject = win.sessionStorage.getItem('sessionProject'))
    cy.log('sessionProject',sessionProject)
})

Then('Check home title', () => {
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

Given('I expand conceptual mappings', () => {
    cy.get('#nav_conceptual\\ mappings').click()
    cy.intercept('GET', appURLPrefix + 'conceptual_mapping_rules*').as('rulesList')
})


Then('I get redirected to  conceptual mappings list page', () => {
    cy.url().should('include','conceptual-mapping-rules') // => true
    cy.wait('@rulesList')
})

Then('I type git url', () => {
    cy.get("input[name=github_repository_url]").clear().type(gitUrl)
})


Then('I type branch name', () => {
    cy.get("input[name=branch_or_tag_name]").clear().type(branchVersion)
})

When('I click on generate button', () => {
    cy.get('#generate_button').click()
})

Then('I get redirected to tasks', () => {
     cy.url().should('include','conceptual-mapping-rules/tasks/generate-cm-assertions-queries') // => true
})

When('I click on run button', () => {
    cy.intercept('POST', appURLPrefix + 'conceptual_mapping_rules/tasks/generate_cm_assertions_queries',).as('run')
    cy.get('#run_button').click()
})

Then('I get success generate', () => {
    cy.wait('@run').its('response.statusCode').should('eq', 201)
})

When('I click on add button', () => {
    cy.get('#add-mapping-rules-button').click()
})

Then('I get redirected to create mapping', () => {
    cy.url().should('include','conceptual-mapping-rules/create')
})

When('I click on edit button', () => {
    cy.get('#edit_button').click()
})


Then('I get redirected to edit rules', () => {
    cy.url().should('include','/edit')
})


When('I click on delete button', () => {
    cy.intercept('DELETE', appURLPrefix + 'conceptual_mapping_rules*').as('delete')
    cy.get('#delete_button').click()
    cy.get('#yes_dialog_button').click()
})

Then('I get Success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})

