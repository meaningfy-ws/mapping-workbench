import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

Given('Go Home', () => {
    cy.visit('localhost:3000')
})

Then('Session Login', () => {
    const username = 'admin@mw.com'
    const password = 'p4$$'
    cy.session([username,password], () => {
        cy.visit('localhost:3000')
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq','App: Projects List | Mapping Workbench')
    })


    // cy.session(username, () => {
    //     cy.request({
    //         method: 'POST',
    //         url: 'localhost:8000/api/v1/auth/jwt/login',
    //         form: true,
    //         body: {username, password},
    //     }).then(({body}) => {
    //         window.sessionStorage.setItem('accessToken', body.access_token)
    //         window.sessionStorage.setItem('token_type',"bearer")
    //         // window.location.replace('localhost:3000')
    //         cy.visit('localhost:3000')
    //
    //     })
    // })
    // Caching session when logging in via page visit
})

Then('Check home title', () => {
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

Given('I expand packages', () => {
    cy.get('#nav_packages').click()
})

When('I click on packages list', () => {
    cy.get("#nav_packages_list").click()
})

Then('I get redirected to mapping_packages list page', () => {
    cy.title().should('eq','App: Mapping Packages List | Mapping Workbench')
})

When('I click on packages create', () => {
    cy.get("#nav_packages_create").click()
})

Then('I get redirected to mapping_packages create page', () => {
    cy.title().should('eq','App: Mapping Package Create | Mapping Workbench')
})

When('I click on packages import', () => {
    cy.get("#nav_packages_import").click()
})

Then('I get redirected to mapping_packages import page', () => {
    cy.title().should('eq','App: Mapping Package Import | Mapping Workbench')
})


When('I expand first package details', () => {
    cy.get('#expand').click()
})


When('I expand first package details', () => {
    cy.get('#expand').click()
})


