Feature: Transform Test Data

  As a valid user want to transform test data

  Scenario: Select Project
    Given Session Login
    Then Go Home
    Then I get redirected to projects list page
    Then I search for project

    When I select project
    Then I get success select
    Then I get redirected to projects list page
#
#  Scenario: Process test data
#    Given Session Login
#    Then Go Home
#    Then I click on test data suites
#    Then I get redirected to test data suites
#
#    When I click on transform test data
#    Then I get redirected to transform test data page
#
#    When I click on run button
#    Then I get success transform

  Scenario: Add Test Data
    Given Session Login
    Then Go Home
    Then I click on test data suites
    Then I get redirected to test data suites

    When I click on add button
    Then I get redirected to create test data page
    Then I enter test data name
    Then I successfully create suite

  Scenario: Update Test Data
    Given Session Login
    Then Go Home
    Then I click on test data suites
    Then I get redirected to test data suites

    Then I search for suite
    Then I receive suite
    Then I click edit button
    Then I get redirected to edit page

    When I enter updated name
    Then I get success update

  Scenario: Delete Test Data
    Given Session Login
    Then Go Home
    Then I click on test data suites
    Then I get redirected to test data suites

    Then I search for updated suite
    Then I receive suite
    Then I click delete button
    Then I get success delete