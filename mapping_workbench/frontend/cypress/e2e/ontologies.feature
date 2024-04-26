Feature: Transform Test Data

  As a valid user want to transform test data

  Scenario: Select Project
    Given Session Login
    Then Go Home
    Then I get redirected to projects list page
    Then I search for project

    When I select project
    Then I get success select
    Then I get redirected to projects list page

  Scenario: Add Ontology
    Given Session Login
    Then Go Home
    Then I click on Ontology
    Then I get redirected to Ontologies

    When I click on add button
    Then I get redirected to create page
    Then I enter name
    Then I successfully create ontology

  Scenario: Update Ontology
    Given Session Login
    Then Go Home
    Then I click on Ontology
    Then I get redirected to Ontologies

    Then I search for ontology
    Then I receive ontology
    Then I click edit button
    Then I get redirected to edit page

    When I enter updated name
    Then I get success update

  Scenario: Delete Ontology
    Given Session Login
    Then Go Home
    Then I click on Ontology
    Then I get redirected to Ontologies

    Then I search for updated ontology
    Then I receive ontology
    Then I click delete button
    Then I get success delete