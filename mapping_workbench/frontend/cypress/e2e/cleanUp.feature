Feature: CleanUp after test

  As a valid user i want cleanup data after tests

  Background:
    Given Session Login
    Then Go Home
    Then Check home title

  Scenario: Delete Packages
    Then Visit Projects
    Then I get redirected to projects list page
    Then I type project name

    When I click on delete button
    Then I click yes button
    Then I get success delete