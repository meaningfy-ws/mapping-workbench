import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";

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
    if(sessionProject) {
        cy.window().then(win => win.sessionStorage.setItem('sessionProject', sessionProject))
    }
})

//create projects

When('I click on add project button', () => {
    cy.get('#add_button').click()
})

Then('I get redirected to projects create page', () => {
    cy.title().should('eq','App: Project Create | Mapping Workbench')
})

Then('I type project name', () => {
    cy.get('input[name=title]').clear().type(projectName)
})

When('I click create button', () => {
    cy.log(appURLPrefix + 'projects')
    cy.intercept('POST', appURLPrefix + 'projects',).as('create')
    cy.get('#create_button').click()
})

Then('I get success created', () => {
    cy.wait('@create',{responseTimeout: 10000}).its('response.statusCode').should('eq',201)
})

When('I click back to projects link', () => {
    cy.get('#back_to_projects').click()
})

//Select project
Then('I search for project', () => {
    cy.get('input[type=text]').clear().type(projectName + '{enter}')
})

When('I select project', () => {
    cy.intercept('POST', appURLPrefix + 'users/set_project_for_current_user_session',).as('select')
    cy.get('#select_button').click()
})

Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
    cy.window().then(win => sessionProject = win.sessionStorage.getItem('sessionProject'))
    cy.log('sessionProject',sessionProject)
})


//import registry
Given('I expand fields registry', () => {
    cy.get('#nav_fields\\ registry').click()
})

When('I click on fields registry import', () => {
    cy.get("#nav_fields\\ registry_import").click()
})

Then('I get redirected to field registry import page', () => {
    cy.url().should('include','fields-registry/elements/import') // => true
})

Then('I type git url', () => {
    cy.get("input[name=github_repository_url]").clear().type(gitUrl)
})


Then('I type branch name', () => {
    cy.get("input[name=branch_or_tag_name]").clear().type(branchVersion)
})

When('I click on import button', () => {
    cy.intercept('POST', appURLPrefix + 'fields_registry/tasks/import_eforms_xsd',).as('import')
    cy.get('#import').click()
})

Then('I get success import', () => {
    cy.wait('@import',{responseTimeout: 999999}).its('response.statusCode').should('eq', 201)
})


//generating conceptual mappings
Given('I click on conceptual mappings', () => {
    cy.get('#nav_conceptual\\ mappings').click()
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

Then('I get redirected to transform test data page', () => {
    cy.url().should('include','tasks/transform_test_data') // => true
})

When('I click on run button for transform data', () => {
    cy.intercept('POST', appURLPrefix + 'tasks/transform_test_data',).as('run_test_data')
    cy.get('#run_button').click()
})

Then('I get success generate', () => {
    cy.wait('@run_conceptual_test_data').its('response.statusCode').should('eq', 201)
})


//importing Mapping Packages
Given('I go to Mapping Packages', () => {
    cy.get('#nav_mapping\\ packages').click()
})
When('I click on Mapping Packages import', () => {
    cy.get("#import_package_button").click()
})

Then('I get redirected to Mapping Packages import page', () => {
    cy.title().should('eq','App: Mapping Package Import | Mapping Workbench')
})

Then('I click on Mapping Packages import button', () => {
    cy.get('#import_button').click()
})

Then('I click on Mapping Packages importer', () => {
    cy.get('.MuiBox-root > input').selectFile('package_eforms_16_1.5.zip', { force: true })
})

Then('I click on upload button', () => {
    cy.intercept('POST', 'http://localhost:8000/api/v1/package_importer/import/archive',).as('upload')
    cy.get('#upload_button').click()
})

Then('I get success upload', () => {
    cy.wait('@upload').its('response.statusCode').should('eq',201)
})


//transform test data
When('I expand tasks', () => {
    cy.get('#nav_tasks').click()
})

Then('I click on transform test data', () => {
    cy.get('#nav_tasks_transform\\ test\\ data').click()
})

Then('I click on run button', () => {
    cy.intercept('POST', appURLPrefix + 'conceptual_mapping_rules/tasks/generate_cm_assertions_queries',).as('run_conceptual_test_data')
    cy.get('#run_button').click()
})

Then('I get success transform', () => {
    cy.wait('@run_test_data',{responseTimeout: 999999}).its('response.statusCode').should('eq', 201)
})

//process Mapping Packages

Then('I get redirected to Mapping Packages list page', () => {
    cy.intercept('GET', 'http://localhost:8000/api/v1/mapping_packages*',).as('getPackages')
    cy.title().should('eq','App: Mapping Packages List | Mapping Workbench')
})

Then('I receive Mapping Packages', () => {
    cy.wait('@getPackages').its('response.statusCode').should('eq',200)
})

Then('I click on expand arrow', () => {
    cy.get('#expand_button').click()
})

When('I click process button', () => {
    cy.intercept('POST', appURLPrefix + 'package_processor/process',).as('process')
    cy.get('#process_button').click()
})

Then('I get processed', () => {
    cy.wait('@process', {responseTimeout: 1999999}).its('response.statusCode').should('eq',200)
})

When('I click export latest button', () => {
    cy.intercept('GET', appURLPrefix + 'package_exporter/export_latest_package_state*',).as('export')
    cy.get('#export_latest_button').click()
})

Then('I get file', () => {
    cy.wait('@export').its('response.statusCode').should('eq',200)
})
