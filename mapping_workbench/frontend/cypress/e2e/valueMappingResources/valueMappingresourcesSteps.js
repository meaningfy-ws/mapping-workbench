import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, projectName} = Cypress.env()

let sessionProject = ''
const resource_name = 'test_resource'

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
})

//add resources

Then('I click on Resources', () => {
    cy.intercept('GET', appURLPrefix + 'resource_collections*').as('get')
    cy.get('#technical_mappings').click()
    cy.get('#value_mapping_resources_tab').click()
})

Then('I get redirected to Resources', () => {
    cy.url().should('include','value-mapping-resources')
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click on add button', () => {
    cy.get('#add_button').click()
})

Then('I get redirected to create page', () => {
    cy.url().should('include','value-mapping-resources/create') // => true
})


Then('I enter name', () => {
    cy.intercept('POST', appURLPrefix + "resource_collections*").as('create')
    cy.get("input[name=title]").clear().type(resource_name)
    cy.get("button[type=submit]").click('right')
})


Then('I successfully create resource', () => {
    cy.wait('@create').its('response.statusCode').should('eq', 201)
})

// update

Then('I search for resource', () => {
    cy.get('input[type=text]').clear().type(resource_name+'{enter}')
})

Then('I receive resources', () => {
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click edit button', () => {
    cy.get('#edit_button').click()
})

Then('I get redirected to edit page', () => {
    cy.url().should('include','/edit') // => true
})

Then('I enter updated name', () => {
    cy.intercept('PATCH', appURLPrefix + 'resource_collections/*').as('update')
    cy.get("input[name=title]").clear().type( resource_name+ 1 +'{enter}')
})

Then('I get success update', () => {
    cy.wait('@update').its('response.statusCode').should('eq', 200)
})

Then('I search for updated resource', () => {
    cy.get('input[type=text]').clear().type(resource_name+1+'{enter}')
})

//delete
Then('I click delete button', () => {
    cy.intercept('DELETE',appURLPrefix + 'resource_collections/*').as('delete')
    cy.get('#delete_button').click()
    cy.get('#yes_dialog_button').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})
