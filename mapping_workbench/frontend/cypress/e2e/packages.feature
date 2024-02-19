Feature: Entry Packages

  As a valid use i want to see package

  Scenario: View Pacakges
    Given Cypress open session
    Then I expand packages
    When I click on packages list
    Then I get redirected to mapping_packages list page

  Scenario: Create Packages
    Given Cypress open session
    Then I expand packages
    When I click on packages create
    Then I get redirected to mapping_packages create page

  Scenario: Import Packages
    Given Cypress open session
    Then I expand packages
    When I click on packages import
    Then I get redirected to mapping_packages import page
