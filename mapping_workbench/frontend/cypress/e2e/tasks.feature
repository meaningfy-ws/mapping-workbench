Feature: Entry Packages

  As a valid use i want to see package
  Scenario: Import Packages
    Given Session Login
    Then Go Home
    Then I go to Mapping Packages
    Then I get redirected to Mapping Packages list page
    When I click on Mapping Packages import
    Then I click select file
    Then I click on upload button
    Then I get success upload

  Scenario: Process test data
    Given Session Login
    Then Go Home
    Then I click on test data suites
    Then I get redirected to test data suites

    When I click on transform test data
    Then I get redirected to transform test data page

    When I click on run button
    Then I get success transform

  Scenario: View Tasks
    Given Session Login
    Then Go Home
    Then I go to Tasks page
    Then I get redirected to Tasks page
    Then I receive Tasks


  Scenario: Refresh Tasks
    Given Session Login
    Then Go Home
    Then I go to Tasks page
    Then I get redirected to Tasks page
    Then I receive Tasks
    Then I click on refresh button
    Then I receive Tasks

  Scenario: Delete Task
    Given Session Login
    Then Go Home
    Then I go to Tasks page
    Then I get redirected to Tasks page
    Then I receive Tasks
    When I delete Task
    Then I get success delete


  Scenario: Delete all Tasks
    Given Session Login
    Then Go Home
    Then I go to Tasks page
    Then I get redirected to Tasks page
    Then I receive Tasks
    When I delete all Tasks
    Then I get success delete all
