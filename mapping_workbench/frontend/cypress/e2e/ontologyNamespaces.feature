Feature: Namespaces

  As a valid user want to interact with Custom Namespaces

  Background:
    Given Session Login
    Then Go Home
    When I go to Namespaces page
    Then I get redirected to Namespaces

  Scenario: Add Namespace
    When I click on add Namespace button
    Then I get redirected to Namespace create page
    Then I enter Namespace name
    Then I successfully create Namespace

  Scenario: Update Namespace
    Then I search for Namespaces
    When I open actions menu
    Then I click edit Namespace button
    Then I get redirected to edit page

    When I enter updated Namespace name
    Then I get success Namespace update

  Scenario: Delete Namespace
    Then I search for updated Namespace
    When I open actions menu
    Then I click delete Namespace button
    Then I get success delete

  Scenario: Add Custom Namespace
    When I click on add Custom Namespace button
    Then I get redirected to Custom Namespace create page
    Then I enter Custom Namespace name
    Then I successfully create Namespace

  Scenario: Delete Custom Namespace Ontology
    Then I search for updated Namespace
    Then I search for Custom Namespaces
    When I open actions menu
    Then I click delete Custom Namespace button
    Then I get success delete