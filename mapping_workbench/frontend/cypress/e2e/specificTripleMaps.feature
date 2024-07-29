Feature: Specific Triple Maps

  As a valid user want to interact with Specific Triple Maps

  Background:
    Given Session Login
    Then Go Home

  Scenario: Select Project
    Then I get redirected to projects list page
    Then I search for project

    When I select project
    Then I get success select
    Then I get redirected to projects list page

  Scenario: Add Specific Triple Maps
    Then I expand Triple Maps Fragments
    Then I click on Specific Triple Maps
    Then I get redirected to Specific Triple Maps

    When I click on add button
    Then I get redirected to create page
    Then I enter name
    Then I successfully create Specific Triple Maps

  Scenario: Update Resource
    Then I expand Triple Maps Fragments
    Then I click on Specific Triple Maps
    Then I get redirected to Specific Triple Maps

    Then I search for Specific Triple Map
    Then I receive Specific Triple Maps
    Then I click edit button
    Then I get redirected to edit page

    When I enter updated name
    Then I get success update

  Scenario: Delete Resource
    Then I expand Triple Maps Fragments
    Then I click on Specific Triple Maps
    Then I get redirected to Specific Triple Maps

    Then I search for updated Specific Triple Map
    Then I receive Specific Triple Maps
    Then I click delete button
    Then I get success delete