Feature: Project Create

  As a valid use i want to create test project

  Scenario: Create Project
    Given Session Login
    Then Go Home

    Then I open side menu
#    Then I click on projects
#    Then I get redirected to projects list page
    Then I select create project from project switch

#    When I click on add project button
    Then I get redirected to projects create page
    Then I type project name
    When I click create button
    Then I get success created