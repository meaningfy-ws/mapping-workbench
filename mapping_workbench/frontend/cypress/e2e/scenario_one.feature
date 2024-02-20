Feature: Entry Projects

  As a valid use i want to see projects

  Scenario: Create Projects
    Given Session Login
    Then Go Home
    Then I expand projects

    When I click on project list
    Then I get redirected to projects list page

    When I click on add project button
    Then I get redirected to projects create page
    Then I type project name

    When I click create button
    Then I get success created
#
  Scenario: Import Packages
    Given Set session project
    Given Session Login
    Then Go Home
    Then I get redirected to projects list page
    Then I search for project

    When I select project
    Then I get success select
    Then I get redirected to projects list page
    Then I expand packages

    When I click on packages import
    Then I get redirected to mapping_packages import page
    Then I click on import button
    Then I click on package importer
    Then I click on upload button
    Then I get success upload

  Scenario: Process Packages
    #TODO select project once
#    Given Set session project
    Given Session Login
    Then Go Home
    Then I get redirected to projects list page
    Then I search for project
    When I select project
    Then I get success select
    Then I get redirected to projects list page
    Then I expand packages

    When I click on packages list
    Then I get redirected to mapping_packages list page
    Then I receive packages
    Then I click on expand arrow

#    When I click process button
#    Then I get processed