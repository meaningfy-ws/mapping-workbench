Feature: Ontology Namespaces

  As a valid user want to interact with Custom Ontology Namespaces
  Background:
    Given Session Login
    Then Go Home


  Scenario: Select Project
    Then I get redirected to projects list page
    Then I search for project

    When I select project
    Then I get success select
    Then I get redirected to projects list page

  Scenario: Add Namespace
    When I click on Ontology Terms
    Then I get redirected to Ontology Terms

    When I click on add namespace button
    Then I get redirected to create page
    Then I enter name
    Then I successfully create Ontology Namespace

  Scenario: Update Namespace
    When I click on Ontology Terms
    Then I get redirected to Ontology Terms

    Then I search for Ontology Namespaces
    Then I receive Ontology Namespaces
    Then I click edit button
    Then I get redirected to edit page

    When I enter updated name
    Then I get success update

  Scenario: Delete Ontology
    When I click on Ontology Terms
    Then I get redirected to Ontology Terms

    Then I search for updated Ontology Namespaces
    Then I receive Ontology Namespaces
    Then I click delete button
    Then I get success delete