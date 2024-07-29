Feature: Schema Files

  As a valid user want to interact with Schema Files

  Background:
    Given Session Login
    Then Go Home

  Scenario: Select Project
    Then I get redirected to projects list page
    Then I search for project

    When I select project
    Then I get success select
    Then I get redirected to projects list page

  Scenario: Upload Schema Files
    Then I click on Schema Files
    Then I get redirected to Schema Files

    When I click on upload button
    Then I select file to upload
    Then I click on ok upload button
    Then I get success upload

  Scenario: Delete Schema Files
    Then I click on Schema Files
    Then I get redirected to Schema Files

    Then I search for Schema Files
    Then I click delete button
    Then I get success delete