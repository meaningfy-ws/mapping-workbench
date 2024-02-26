import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const gitUrl = "https://github.com/OP-TED/eForms-SDK"
const branchVersion = "1.9.1"
const projectName = 'TEST_PROJECT'
let sessionProject = ''
Given('Go Home', () => {
    cy.visit('localhost:3000')
})

Given('Session Login', () => {
    // Caching session when logging in via page visit
    const username = 'admin@mw.com'
    const password = 'p4$$'
    cy.session([username,password], () => {
        cy.visit('localhost:3000')
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq','App: Projects List | Mapping Workbench')
    })
    if(sessionProject) cy.window().then(win => win.sessionStorage.setItem('sessionProject',sessionProject))
})

Then('I expand projects', () => {
    cy.get('#nav_projects').click()
})

When('I click on project list', () => {
    cy.get("#nav_projects_list").click()
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
    cy.log('sessionProject',sessionProject)
})

Then('Check home title', () => {
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

Given('I expand conceptual mappings', () => {
    cy.get('#nav_conceptual\\ mappings').click()
})

When('I click on conceptual mappings list', () => {
    cy.get("#nav_conceptual\\ mappings_list").click()
})

Then('I get redirected to  conceptual mappings list page', () => {
    cy.url().should('include','conceptual-mapping-rules') // => true
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
    cy.intercept('POST', 'http://localhost:8000/api/v1/conceptual_mapping_rules/tasks/generate_cm_assertions_queries',).as('run')
    cy.get('#run_button').click()
})

Then('I get success generate', () => {
    cy.wait('@run').its('response.statusCode').should('eq', 200)
})
