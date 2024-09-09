Feature: SHACL Test Suite

  As a valid user want to interact with SHACL Test Suite


  Background:
    Given Session Login
    Then Go Home
    Then I open side menu

#  Scenario: Select Project
#    Then I get redirected to projects list page
#    Then I search for project
#
#    When I select project
#    Then I get success select
#    Then I get redirected to projects list page

  Scenario: Add SHACL Test Suite
    Then I click on Shacl Test Suites
    Then I get redirected to Shacl Test Suites

    When I click on add button
    Then I get redirected to create page
    Then I enter name
    Then I successfully create suite

  Scenario: Update SHACL Test Suite
    Then I click on Shacl Test Suites
    Then I get redirected to Shacl Test Suites

    Then I search for suite
    Then I click edit button
    Then I get redirected to edit page

    When I enter updated name
    Then I get success update

  Scenario: Delete SHACL Test Suite
    Then I click on Shacl Test Suites
    Then I get redirected to Shacl Test Suites

    Then I search for updated suite
    Then I click delete button
    Then I get success delete