Feature: Entry Packages

  As a valid use i want to see package
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

  Scenario: View Pacakges
    Given Session Login
    Then Go Home
    Then I expand packages
    When I click on packages list
    Then I get redirected to mapping_packages list page
    Then I receive packages
    When I expand first package details

  Scenario: Create Packages
    Given Session Login
    Then Go Home
    Then I expand packages
    When I click on packages create
    Then I get redirected to mapping_packages create page
