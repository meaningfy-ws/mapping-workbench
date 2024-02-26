Feature: Import Fields Registry

  As a valid use i want to see package

  Scenario: Select Project
    Given Session Login
    Then Go Home
    Then I expand projects

    When I click on project list
    Then I get redirected to projects list page
    Then I search for project
    Then I select project
    Then I get success select

  Scenario: Generate Conceptual mappings
    Given Session Login
    Then Go Home
    Then I expand conceptual mappings

    When I click on conceptual mappings list
    Then I get redirected to  conceptual mappings list page

    When I click on generate button
    Then I get redirected to tasks

    When I click on run button
    Then I get success generate