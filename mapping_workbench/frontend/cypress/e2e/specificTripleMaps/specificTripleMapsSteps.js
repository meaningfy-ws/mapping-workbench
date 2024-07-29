import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, projectName} = Cypress.env()


let sessionProject = ''
const specificTripleMapName = 'test_specific_triple_map'

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

//add resources

When('I expand Triple Maps Fragments', () => {
    cy.get(':nth-child(4) > #nav_triple_map_fragments').click()
})

Then('I click on Specific Triple Maps', () => {
    cy.intercept('GET', appURLPrefix + 'specific_triple_map_fragments*').as('get')
    cy.get('#nav_specific_triple_maps').click()
})

Then('I get redirected to Specific Triple Maps', () => {
    cy.url().should('include','specific-triple-map-fragments')
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click on add button', () => {
    cy.get('#add_button').click()
})

Then('I get redirected to create page', () => {
    cy.url().should('include','specific-triple-map-fragments/create') // => true
})


Then('I enter name', () => {
    cy.intercept('POST', appURLPrefix + 'specific_triple_map_fragments*').as('create')
    cy.get("input[name=mapping_package_id]").parent().click()
    .get('ul.MuiList-root').click()
    cy.get("input[name=triple_map_uri]").clear().type(specificTripleMapName)
    cy.get("button[type=submit]").click()
})


Then('I successfully create Specific Triple Maps', () => {
    cy.wait('@create').its('response.statusCode').should('eq', 201)
})

// update

Then('I search for Specific Triple Map', () => {
    cy.get('input[type=text]').clear().type(specificTripleMapName + '{enter}')
})

Then('I receive Specific Triple Maps', () => {
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click edit button', () => {
    cy.get('#edit_button').click()
})

Then('I get redirected to edit page', () => {
    cy.url().should('include','/edit') // => true
})

Then('I enter updated name', () => {
    cy.intercept('PATCH', appURLPrefix + 'specific_triple_map_fragments/*').as('update')
    cy.get("input[name=triple_map_uri]").clear().type( specificTripleMapName + 1 +'{enter}')
})

Then('I get success update', () => {
    cy.wait('@update').its('response.statusCode').should('eq', 200)
})

Then('I search for updated Specific Triple Map', () => {
    cy.get('input[type=text]').clear().type(specificTripleMapName + 1 + '{enter}')
})

//delete
Then('I click delete button', () => {
    cy.intercept('DELETE',appURLPrefix + 'specific_triple_map_fragments/*').as('delete')
    cy.get('#delete_button').click()
    cy.get('#yes_dialog_button').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})
