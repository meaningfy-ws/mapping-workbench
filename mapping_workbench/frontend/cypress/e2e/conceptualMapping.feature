Feature: Import Fields Registry

  As a valid use i want to see package

  Scenario: Select Project
    Given Session Login
    Then Go Home
    Then I click on projects

    Then I get redirected to projects list page
    Then I search for project
    Then I select project
    Then I get success select

  Scenario: Generate Conceptual mappings
    Given Session Login
    Then Go Home
    Then I expand conceptual mappings
    Then I get redirected to  conceptual mappings list page

    When I click on generate button
    Then I get redirected to tasks

    When I click on run button
    Then I get success generate

  Scenario: Add Conceptual mapping
    Given Session Login
    Then Go Home
    Then I expand conceptual mappings

    When I click on add button
    Then I get redirected to create mapping

  Scenario: Edit Conceptual mapping
    Given Session Login
    Then Go Home
    Then I expand conceptual mappings

    When I click on edit button
    Then I get redirected to edit rules

  Scenario: Delete Conceptual mapping
    Given Session Login
    Then Go Home
    Then I expand conceptual mappings
    Then I get redirected to  conceptual mappings list page

    When I click on delete button
    Then I get redirected to edit rules
    Then I get Success delete