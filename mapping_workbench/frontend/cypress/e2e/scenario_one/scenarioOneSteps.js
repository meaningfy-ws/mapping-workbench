import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";

const username = 'admin@mw.com'
const password = 'p4$$'
const project_name ='TEST_PROJECT'
// let sessionProject = ''
Given('Go Home', () => {
    cy.visit('localhost:3000')
})

Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username,password], () => {
        cy.visit('localhost:3000')
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        // cy.window().then(win => win.sessionStorage.setItem('sessionProject',sessionProject))
        cy.title().should('eq','App: Projects List | Mapping Workbench')
    })
})

Given('Set session project', () => {
    // cy.window().then(win => win.sessionStorage.setItem('sessionProject',sessionProject))
})
//create projects
Then('I expand projects', () => {
    cy.get('#nav_projects').click()
})

When('I click on packages list', () => {
    cy.get("#nav_packages_list").click()
})

When('I click on project list', () => {
    cy.get("#nav_projects_list").click()
})

Then('I get redirected to projects list page', () => {
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

When('I click on add project button', () => {
    cy.get('#add_button').click()
})


Then('I get redirected to projects create page', () => {
    cy.title().should('eq','App: Project Create | Mapping Workbench')
})


Then('I type project name', () => {
    cy.get('input[name=title]').clear().type(project_name)
})

When('I click create button', () => {
    cy.intercept('POST', 'http://localhost:8000/api/v1/projects',).as('create')
    cy.get('#create_button').click()
})

Then('I get success created', () => {
    cy.wait('@create').its('response.statusCode').should('eq',201)
})

When('I click back to projects link', () => {
    cy.get('#back_to_projects').click()
})

Then('I search for project', () => {
    cy.get('input[type=text]').clear().type(project_name+'{enter}')
})

When('I select project', () => {
    cy.intercept('POST', 'http://localhost:8000/api/v1/users/set_project_for_current_user_session',).as('select')
    cy.get('#select_button').click()
})

Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
    // sessionProject = cy.window().then(win => win.sessionStorage.getItem('sessionProject'))
})

//importing packages
Given('I expand packages', () => {
    // if (sessionProject)
    //     window.sessionStorage.setItem('sessionProject',sessionProject)
    cy.get('#nav_packages').click()
})
When('I click on packages import', () => {
    cy.get("#nav_packages_import").click()
})

Then('I get redirected to mapping_packages import page', () => {
    cy.title().should('eq','App: Mapping Package Import | Mapping Workbench')
})

Then('I click on import button', () => {
    cy.get('#import_button').click()
})

Then('I click on package importer', () => {
    cy.get('.MuiBox-root > input').selectFile('package_eforms_16_1.5.zip', { force: true })
})

Then('I click on upload button', () => {
    cy.intercept('POST', 'http://localhost:8000/api/v1/package_importer/import/v3',).as('upload')
    cy.get('#upload_button').click()
})

Then('I get success upload', () => {
    cy.wait('@upload').its('response.statusCode').should('eq',201)
})

Then('I get redirected to mapping_packages list page', () => {
    cy.intercept('GET', 'http://localhost:8000/api/v1/mapping_packages*',).as('getPackages')
    cy.title().should('eq','App: Mapping Packages List | Mapping Workbench')
})

Then('I receive packages', () => {
    cy.wait('@getPackages').its('response.statusCode').should('eq',200)
})

Then('I click on expand arrow', () => {
    cy.get('#expand_button').click()
})

When('I click process button', () => {
    cy.intercept('POST', 'http://localhost:8000/api/v1/package_processor/process',).as('process')
    cy.get('#process_button').click()
})

Then('I get processed', () => {
    cy.wait('@process').its('response.statusCode').should('eq',200)
})