Feature: Entry Projects

  As a valid use i want to see projects

  Scenario: Create Projects
    Given Session Login
    Then Go Home
    Then I expand projects

    When I click on packages list
    Then I get redirected to projects list page

    When I click on add project button
    Then I get redirected to projects create page
    Then I type project name

    When I click create button
    Then I get success created

    When I click back to projects link
    Then I get redirected to projects list page
    Then I search for project

    When I select project
    Then I get success select

  Scenario: Import Packages
    Given Session Login
    Then Go Home
    Then I expand packages

    When I click on packages import
    Then I get redirected to mapping_packages import page
    Then I click on import button
    Then I click on package importer
    Then I click on upload button
    Then I get success upload
