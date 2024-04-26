Feature: Ontology Namespaces

  As a valid user want to transform test data

  Scenario: Select Project
    Given Session Login
    Then Go Home
    Then I get redirected to projects list page
    Then I search for project

    When I select project
    Then I get success select
    Then I get redirected to projects list page

  Scenario: Add Namespace
    Given Session Login
    Then Go Home

    When I expand Ontology
    Then I click on Namespaces
    Then I get redirected to Ontology Namespaces

    When I click on add button
    Then I get redirected to create page
    Then I enter name
    Then I successfully create Ontology Namespace

  Scenario: Update Namespace
    Given Session Login
    Then Go Home

    When I expand Ontology
    Then I click on Namespaces
    Then I get redirected to Ontology Namespaces

    Then I search for Ontology Namespaces
    Then I receive Ontology Namespaces
    Then I click edit button
    Then I get redirected to edit page

    When I enter updated name
    Then I get success update

  Scenario: Delete Ontology
    Given Session Login
    Then Go Home

    When I expand Ontology
    Then I click on Namespaces
    Then I get redirected to Ontology Namespaces

    Then I search for updated Ontology Namespaces
    Then I receive Ontology Namespaces
    Then I click delete button
    Then I get success delete