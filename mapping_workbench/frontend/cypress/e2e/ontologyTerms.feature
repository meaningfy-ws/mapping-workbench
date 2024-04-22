Feature: Ontology Terms

  As a valid user want to transform test data

  Scenario: Select Project
    Given Session Login
    Then Go Home
    Then I get redirected to projects list page
    Then I search for project

    When I select project
    Then I get success select
    Then I get redirected to projects list page

  Scenario: Discover Terms
    Given Session Login
    Then Go Home

    When I expand Ontology
    Then I click on Terms
    Then I get redirected to Ontology Terms

    When I click on discover button
    Then I successfully discover Ontology Terms

  Scenario: Add Terms
    Given Session Login
    Then Go Home

    When I expand Ontology
    Then I click on Terms
    Then I get redirected to Ontology Terms

    When I click on add button
    Then I get redirected to create page
    Then I enter name
    Then I successfully create Ontology Terms

  Scenario: Update Namespace
    Given Session Login
    Then Go Home

    When I expand Ontology
    Then I click on Terms
    Then I get redirected to Ontology Terms

    Then I search for Ontology Terms
    Then I receive Ontology Terms
    Then I click edit button
    Then I get redirected to edit page

    When I enter updated name
    Then I get success update

  Scenario: Delete Ontology
    Given Session Login
    Then Go Home

    When I expand Ontology
    Then I click on Terms
    Then I get redirected to Ontology Terms

    Then I search for updated Ontology Terms
    Then I receive Ontology Terms
    Then I click delete button
    Then I get success delete