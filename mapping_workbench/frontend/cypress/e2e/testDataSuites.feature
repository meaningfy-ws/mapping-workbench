Feature: Test Data Suites

  As a valid user want to interact with Test Data Suites

  Background:
    Given Session Login
    Then Go Home
    Then I go to Test Data Suites page
    Then I get redirected to test data suites

  Scenario: Add Test Data
    When I click on add button
    Then I get redirected to create test data page
    Then I enter test data name
    Then I successfully create suite

  Scenario: Update Test Data
    Then I search for suite
    Then I click view button
    Then I click edit button
    Then I get redirected to edit page

    When I enter updated name
    Then I get success update

  Scenario: Delete Test Data
    Then I search for updated suite
    Then I click delete button
    Then I get success delete