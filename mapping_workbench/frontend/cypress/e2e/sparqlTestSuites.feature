Feature: SPARQL Test Suites

  As a valid user want to interact with SPARQL Test Suites

  Background:
    Given Session Login
    Then Go Home
    Then I click on Sparql Test Suites
    Then I get redirected to Sparql Test Suites

  Scenario: Add SPARQL Test Suite

    When I click on add button
    Then I get redirected to create page
    Then I enter name
    Then I successfully create suite

  Scenario: Update SPARQL Test Suite

    Then I search for suite
    Then I click edit button
    Then I get redirected to edit page

    When I enter updated name
    Then I get success update

  Scenario: Delete SPARQL Test Suite

    Then I search for updated suite
    Then I click delete button
    Then I get success delete