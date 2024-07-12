Feature: Fields List

  As a valid use i want to interact with Fields List

  Background:
    Given Session Login
    Then Go Home

  Scenario: Select Project
    Then I click on projects

    Then I get redirected to projects list page
    Then I search for project
    Then I select project
    Then I get success select

  Scenario: Import Fields List
    Then I click on Fields List
    Then I get redirected to Fields List
    When I click on import schema button
    Then I get redirected to field registry import page
    Then I type git url
    Then I type branch name

    When I click on import button
    Then I get success import

  Scenario: View Fields Registry
    When I click on Fields List
    Then I get redirected to Fields List
    And I receive fields

    When I click on view button