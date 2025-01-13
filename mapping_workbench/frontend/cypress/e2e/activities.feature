Feature: Activities

  As a valid user i want to interact with Activities page

  Background:
    Given Session Login
    Then Go Home

  Scenario: Import Packages
    When I open side menu
    Then I go to Mapping Packages
    Then I get redirected to Mapping Packages list page
    When I click on Mapping Packages import
    Then I click select file
    Then I click on upload button
    Then I get success upload

  Scenario: View Activities
    When I open side menu
    Then I go to Activities page
    Then I get redirected to Tasks page
    Then I receive Tasks

  Scenario: Refresh Activities
    When I open side menu
    Then I go to Activities page
    Then I get redirected to Tasks page
    Then I receive Tasks
    Then I click on refresh button
    Then I receive Tasks

  Scenario: Delete Activity
    When I open side menu
    Then I go to Activities page
    Then I get redirected to Tasks page
    Then I receive Tasks
    When I open actions menu
    When I delete Task
    Then I get success delete

  Scenario: Delete all Activities
    When I open side menu
    Then I go to Activities page
    Then I get redirected to Tasks page
    Then I receive Tasks
    When I delete all Tasks
    Then I get success delete all
