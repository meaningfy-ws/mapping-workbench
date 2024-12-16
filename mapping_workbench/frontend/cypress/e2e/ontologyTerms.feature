Feature: Ontology Terms

  As a valid user want to transform test data

  Background:
    Given Session Login
    Then Go Home
    When I go to Ontology Terms page
    Then I get redirected to Ontology Terms

  Scenario: Discover Terms
    When I click on discover button
    Then I successfully add task for discover Ontology Terms

  Scenario: Add Ontology Terms
    When I click on add term button
    Then I get redirected to create page
    Then I enter name of Ontology Term
    Then I successfully create Ontology Terms

  Scenario: Delete Ontology Term
    Then I search for Ontology Terms
    When I open actions menu
    Then I click delete button
    Then I get success delete