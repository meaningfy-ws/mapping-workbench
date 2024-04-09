import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";

const username = 'admin@mw.com'
const password = 'p4$$'
const project_name ='TEST_PROJECT'
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

When('I expand Triple Maps', () => {
    cy.get('#nav_triple\\ maps').click()
})

Then('I click on Generic Triple Maps', () => {
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

Then('I click on upload button', () => {
    cy.intercept('POST', appURLPrefix + 'generic_triple_map_fragments',).as('upload')
    cy.get('#upload_button').click()
})

Then('I get success upload', () => {
    cy.wait('@upload').its('response.statusCode').should('eq',201)
})

Then('I search for triple map', () => {
    cy.get('input[type=text]').clear().type(tripleMapFragment+'{enter}')
})

When('I edit triple map fragment', () => {
    cy.get('#edit_button').click()
})


Then('I click update and transform button', () => {
    cy.intercept('PATCH',appURLPrefix + 'generic_triple_map_fragments/*').as('updateFragment')
    cy.intercept('POST',appURLPrefix + 'test_data_suites/file_resources/*').as('transformFragment')
    cy.get('#update_and_transform_button').click()
})

Then('I get success update triple map fragment', () => {
    cy.wait('@updateFragment').its('response.statusCode').should('eq',200)
})

And('I get success transform triple map fragment', () => {
    cy.wait('@transformFragment').its('response.statusCode').should('eq',200)
})