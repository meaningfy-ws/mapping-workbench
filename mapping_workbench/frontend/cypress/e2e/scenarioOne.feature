Feature: Scenario One

  As a valid user i run scenarion one

  Scenario: Create Project
    Given Session Login
    Then Go Home

    When I click on projects
    Then I get redirected to projects list page

    When I click on add project button
    Then I get redirected to projects create page
    Then I type project name

    When I click create button
    Then I get success created

  Scenario: Select Project
    Given Session Login
    Then Go Home
    Then I get redirected to projects list page
    Then I search for project

    When I select project
    Then I get success select
    Then I get redirected to projects list page

  Scenario: Import Fields Registry
    Given Session Login
    Then Go Home

    When  I expand fields registry
    And   I click on fields registry import
    Then  I get redirected to field registry import page
    Then  I type git url
    And   I type branch name

    When  I click on import button
    Then  I get success import

  Scenario: Import Package
    Given Session Login
    Then Go Home
    Then I go to Mapping Packages

    When I click on Mapping Packages import
    Then I click on Mapping Packages importer
    Then I click on upload button
    Then I get success upload

  Scenario: Generate Conceptual mappings
    Given Session Login
    Then Go Home

    When I click on conceptual mappings
    Then I get redirected to  conceptual mappings list page

    When I click on generate button
    Then I get redirected to tasks

    When I click on run button
    Then I get success generate


  Scenario: Process test data
    Given Session Login
    Then Go Home
    Then I expand tasks

    When I click on transform test data
    Then I get redirected to transform test data page

    When I click on run button for transform data
    Then I get success transform

  Scenario: Process Package
    Given Session Login
    Then Go Home
    Then I get redirected to projects list page

    When I go to Mapping Packages
    Then I get redirected to Mapping Packages list page
    Then I receive Mapping Packages
    Then I click on expand arrow

    When I click process button
    Then I get processed

  Scenario: Export Package
    Given Session Login
    Then Go Home
    Then I get redirected to projects list page

    When I go to Mapping Packages
    Then I get redirected to Mapping Packages list page
    Then I receive Mapping Packages
    Then I click on expand arrow

    When I click export latest button
    Then I get file