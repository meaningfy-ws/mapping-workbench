Feature: Import Fields Registry

  As a valid use i want to see package

  Scenario: Select Project
    Given Session Login
    Then Go Home
    Then I expand projects

    Then I get redirected to projects list page
    Then I search for project
    Then I select project
    Then I get success select

  Scenario: Import Fields Registry
    Given Session Login
    Then Go Home

    Then I expand fields registry
    When I click on fields registry import
    Then I get redirected to field registry import page
    Then I type git url
    Then I type branch name

    When I click on import button
    Then I get success import

  Scenario: View Fields Registry
    Given Session Login
    Then Go Home
    Then I expand fields registry

    When I click on fields registry elements
    Then I get redirected to fields registry elements
    And I receive fields

    When I click on view button