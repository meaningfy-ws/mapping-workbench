Feature: Generic Triple Maps

  As a valid user want to interact with Generic Triple Maps

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

  Scenario: Add Triple Map Fragment
    Then I click on Triple Map Fragments
    Then I get redirected to Generic Triple Maps

    When I click on add button
    Then I get redirected to create page
    Then I enter name
    Then I successfully create Generic Triple Maps

  Scenario: Update Resource
    Then I click on Triple Map Fragments
    Then I get redirected to Generic Triple Maps

    Then I search for Generic Triple Map
    Then I click edit button
    Then I get redirected to edit page

    When I enter updated name
    Then I get success update

  Scenario: Delete Resource
    Then I click on Triple Map Fragments
    Then I get redirected to Generic Triple Maps

    Then I search for updated Generic Triple Map
    Then I click delete button
    Then I get success delete