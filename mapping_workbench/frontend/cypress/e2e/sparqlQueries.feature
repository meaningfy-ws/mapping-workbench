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

  Scenario: Run SPARQL Queries
    Given Session Login
    Then Go Home
    Then I expand Tasks
    Then I click on SPARQL Queries
    Then I get redirected to SPARQL Queries

    When I click on run button
    Then I get success result
