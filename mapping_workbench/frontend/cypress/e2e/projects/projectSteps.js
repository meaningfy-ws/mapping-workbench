import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";

const {username, password, homeURL, appURLPrefix, projectName, homePageLabel} = Cypress.env()

const projectDescription = 'some description'

Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username,password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq',homePageLabel)
    })
})


Then('I get redirected to projects list page', () => {
    cy.title().should('eq',homePageLabel)
})

When('I click on add project button', () => {
    cy.get('#add_button').click()
})


Then('I get redirected to projects create page', () => {
    cy.title().should('eq','App: Project Create | Mapping Workbench')
})


Then('I type project name', () => {
    cy.get('input[name=title]').clear().type(projectName)
})

Then('I uncheck checkboxes', () => {
    cy.get('input[name=automatically_discover_namespaces]').uncheck()
    cy.get('input[name=add_specific_namespaces]').uncheck()
    cy.get('input[name="import_eform.checked"]').uncheck()

})

When('I click create button', () => {
    cy.intercept('POST', appURLPrefix + 'projects').as('create')
    cy.get('#create_button').click()
})

Then('I get success created', () => {
    cy.wait('@create').its('response.statusCode').should('eq',201)
})

When('I click back to projects link', () => {
    cy.get('#back_to_projects').click()
})

Then('I search for project', () => {
    // cy.intercept('GET', appURLPrefix + '/projects*',).as('get')
    cy.get('input[type=text]').clear().type(projectName + '{enter}')
})

Then('I receive project', () => {
    cy.wait('@get').its('response.statusCode').should('eq',200)
})

When('I select project', () => {
    cy.intercept('POST', appURLPrefix + 'users/set_project_for_current_user_session',).as('select')
    cy.get('#select_button').click()
})

Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
})

//edit project
When('I click on edit button', () => {
    cy.get('#edit_button').click()
})

Then('I get redirected to project edit page', () => {
    cy.url().should('include','/edit')
})

Then('I update project description', () => {
    cy.get('textarea[name=description]').clear().type(projectDescription + '{enter}')
})

Then('I click on update button', () => {
    cy.intercept('PATCH', appURLPrefix + 'projects/*',).as('updateProject')
    cy.get('#create_button').click("right")
})

Then('I receive update success', () => {
    cy.wait('@updateProject').its('response.statusCode').should('eq',200)
})

//edit project
When('I click on view button', () => {
    cy.get('#view_button').click()
})

Then('I get redirected to project view page', () => {
    cy.url().should('include','/view')
})

Then('I read description', () => {
    cy.get('h6:contains("Description")').first().next().should('have.text', projectDescription+'\n')
})

//delete project
When('I click on delete button', () => {
    cy.get('#delete_button').click()
})

Then('I click yes button', () => {
    cy.intercept('DELETE', appURLPrefix + 'projects/*',).as('delete')
    cy.get('#yes_dialog_button').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq',200)
})
