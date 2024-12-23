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


When('I click on Fields Tree', () => {
    cy.intercept('GET', appURLPrefix + 'fields_registry/elements_tree*',).as('get')
    cy.get('#elements_definition').click()
    cy.get("#elements_define_tree_tab").click()
})


Then('I get redirected to Fields Tree', () => {
    cy.url().should('include','fields-and-nodes/tree-view')
})

And('I receive Fields Tree', () => {
    cy.wait('@get')
})
