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

  Scenario: Add SPARQL Suite
    Given Session Login
    Then Go Home
    Then I click on Sparql Test Suites
    Then I get redirected to Sparql Test Suites

    When I click on add button
    Then I get redirected to create page
    Then I enter name
    Then I successfully create suite

  Scenario: Update Sparql Test Suite
    Given Session Login
    Then Go Home
    Then I click on Sparql Test Suites
    Then I get redirected to Sparql Test Suites

    Then I search for suite
    Then I receive suite
    Then I click edit button
    Then I get redirected to edit page

    When I enter updated name
    Then I get success update

  Scenario: Delete Sparql Test Suite
    Given Session Login
    Then Go Home
    Then I click on Sparql Test Suites
    Then I get redirected to Sparql Test Suites

    Then I search for updated suite
    Then I receive suite
    Then I click delete button
    Then I get success delete