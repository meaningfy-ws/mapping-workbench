Feature: Resources

  As a valid user want to explore Resources

  Background:
    Given Session Login
    Then Go Home

  Scenario: Add Resource
    Then I click on Resources
    Then I get redirected to Resources

    When I click on add button
    Then I get redirected to create page
    Then I enter name
    Then I successfully create resource

  Scenario: Update Resource
    Then I click on Resources
    Then I get redirected to Resources

    Then I search for resource
    Then I click edit button
    Then I get redirected to edit page

    When I enter updated name
    Then I get success update

  Scenario: Delete Resource
    Then I click on Resources
    Then I get redirected to Resources

    Then I search for updated resource
    Then I click delete button
    Then I get success delete