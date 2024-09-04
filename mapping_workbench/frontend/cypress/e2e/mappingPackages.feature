Feature: Mapping Packages

  As a valid use i want to interact with Mapping Packages

  Background:
    Given Session Login
    Then Go Home
    Then I open side menu
    Then I go to Mapping Packages
    Then I get redirected to Mapping Packages list page

  Scenario: Import Packages
    When I click on Mapping Packages import
    Then I click select file
    Then I click on upload button
    Then I get success upload

  Scenario: View Pacakges
    Then I receive Mapping Packages
    When I expand first package details

  Scenario: Create Packages
    When I click on add Mapping Packages button
    Then I get redirected to Mapping Packages create page
    Then I enter name and id
    Then I click on submit button
    Then I get success create


  Scenario: Update Package
    Then I search for Mapping Package
    Then I edit Mapping Package
    Then I update name
    Then I click on submit button
    Then I get success update

  Scenario: Delete Package
    Then I search for updated Mapping Package
    When I delete Mapping Package
    Then I click yes
    Then I get success delete