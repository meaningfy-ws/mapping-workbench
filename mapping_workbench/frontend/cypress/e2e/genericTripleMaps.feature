Feature: Generic Triple Maps

  As a valid user check generic triple maps

  Background:
    Given Session Login
    Then Go Home

  Scenario: Select Project
    Then I click on projects

    Then I get redirected to projects list page
    Then I search for project
    Then I select project
    Then I get success select

  Scenario: Upload Triple Map Fragment
    Then I click on Generic Triple Maps
    Then I get redirected to generic triple maps fragments page

    When I click on upload fragment button
    Then I click select file
    Then I click on upload button
    Then I get success upload

  Scenario: Add triple map fragment
    Then I click on Generic Triple Maps
    Then I get redirected to generic triple maps fragments page
    Then I receive generic fragments

    Then I click on add button
    Then I get redirected to create fragments page
    Then I enter triple fragment name
    Then Create success

  Scenario: Edit triple map fragment
    Then I click on Generic Triple Maps
    Then I get redirected to generic triple maps fragments page
    Then I receive generic fragments
    Then I search for triple map
    Then I receive generic fragments
    Then I edit triple map fragment
    Then I get redirected to edit page
    Then I enter triple fragment name
    Then I get success update triple map fragment

  Scenario: Delete triple map fragment
    Then I click on Generic Triple Maps
    Then I get redirected to generic triple maps fragments page
    Then I receive generic fragments
    Then I search for triple map
    Then I receive generic fragments
    Then I click on delete button
    Then I get Success delete
    Then I search for triple map
    Then I receive generic fragments
    Then I click on delete button
    Then I get Success delete
#
