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

  Scenario: Run Terms Validator
    Given Session Login
    Then Go Home
    Then I expand Tasks
    Then I click on Term Validator
    Then I get redirected to Term Validator

    When I click on run button
    Then I get success result
