import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, homePageLabel} = Cypress.env()
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


When('I click on Fields And Nodes', () => {
    cy.intercept('GET', appURLPrefix + 'test_data_suites/file_resources_struct_tree*',).as('getTree')
    cy.intercept('GET', appURLPrefix + 'fields_registry/elements*',).as('getElements')
    cy.get('#nav_fields_\\&_nodes').click()
    cy.get("#nav_develop").click()
})


Then('I get redirected to Fields And Nodes', () => {
    cy.url().should('include','fields-and-nodes')
})

And('I receive Struct Tree', () => {
    cy.wait('@getTree')
})

And('I receive Elements', () => {
    cy.wait('@getElements')
})