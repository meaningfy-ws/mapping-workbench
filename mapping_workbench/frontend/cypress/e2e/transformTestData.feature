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

  Scenario: Process test data
    Given Session Login
    Then Go Home
    Then I expand tasks

    When I click on transform test data
    Then I get redirected to transform test data page

    When I click on run button
    Then I get success transform