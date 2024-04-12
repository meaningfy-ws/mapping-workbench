import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";

const username = 'admin@mw.com'
const password = 'p4$$'
const projectName ='TEST_PROJECT'

let sessionProject = ''
const tripleMapFragment = 'test.rml.ttl'
const appURLPrefix = 'http://localhost:8000/api/v1/'
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
        cy.title().should('eq','App: Projects List | Mapping Workbench')
    })
    if(sessionProject) {
        cy.window().then(win => win.sessionStorage.setItem('sessionProject', sessionProject))
    }
})

Then('I click on projects', () => {
    cy.get('#nav_projects').click()
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

When('I expand Triple Maps', () => {
    cy.get('#nav_triple\\ maps').click()
})

Then('I click on Generic Triple Maps', () => {
    cy.intercept('GET', appURLPrefix + 'generic_triple_map_fragments*').as('getFragments')
    cy.get('#nav_triple\\ maps_generic\\ triple\\ maps').click()
})

Then('I get redirected to generic triple maps fragments page', () => {
    cy.url().should('include','generic-triple-map-fragments') // => true
})

When('I click on upload fragment button', () => {
    cy.get('#upload_fragment_button').click()
})

Then("I click select file", () => {
    cy.get('.MuiBox-root > input').selectFile(tripleMapFragment, { force: true })
})

Then('I receive generic fragments', () => {
    cy.wait('@getFragments')
})
Then('I click on upload button', () => {
    cy.intercept('POST', appURLPrefix + 'generic_triple_map_fragments',).as('upload')
    cy.get('#upload_button').click()
})

Then('I click on add button', () => {
    cy.get('#add_button').click()
})

Then('I get success upload', () => {
    cy.wait('@upload').its('response.statusCode').should('eq',201)
})

Then('I get redirected to create fragments page', () => {
    cy.url().should('include','/create')
})

Then('I enter triple fragment name', () => {
    cy.intercept('PATCH', appURLPrefix + 'generic_triple_map_fragments/*').as('update')
    cy.intercept('POST', appURLPrefix + 'generic_triple_map_fragments').as('create')
    cy.get('input[name=triple_map_uri]').clear().type(tripleMapFragment + 1 +'{enter}')
})


// Then('I enter triple fragment name on create', () => {
//     cy.get('input[name=triple_map_uri]').clear().type(tripleMapFragment + 1 +'{enter}')
//
// })
Then('I search for triple map', () => {
    cy.get('input[type=text]').clear().type(tripleMapFragment + '{enter}')
})


Then('Create success', () => {
    cy.wait('@create').its('response.statusCode').should('eq',201)
})

When('I edit triple map fragment', () => {
    cy.get('#edit_button').click()
})


Then('I click update and transform button', () => {
    cy.intercept('PATCH',appURLPrefix + 'generic_triple_map_fragments/*').as('updateFragment')
    cy.get('#update_and_transform_button').click()
})

Then('I get success update triple map fragment', () => {
    cy.wait('@update').its('response.statusCode').should('eq',200)
})

And('I get success transform triple map fragment', () => {
    cy.wait('@transformFragment').its('response.statusCode').should('eq',200)
})

Then('I get redirected to edit page', () => {
    cy.url().should('include','/edit')
})

Then('I search for triple map 1', () => {
    cy.get('input[type=text]').clear().type(tripleMapFragment + 1 + '{enter}')
})

When('I click on delete button', () => {
    cy.intercept('DELETE', appURLPrefix + 'generic_triple_map_fragments/*').as('delete')
    cy.get('#delete_button').click()
    cy.get('#yes_dialog_button').click()
})

Then('I get Success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})
