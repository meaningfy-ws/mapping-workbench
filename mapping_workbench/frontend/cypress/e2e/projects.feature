Feature: Entry Projects

  As a valid use i want to be sure that projects page work fine

  Scenario: Create Project
    Given Session Login
    Then Go Home
    Then Visit Projects
    Then I get redirected to projects list page

    When I click on add project button
    Then I get redirected to projects create page
    Then I type project name
    When I click create button
    Then I get success created

  Scenario: Select Project
    Given Session Login
    Then Go Home

    Then Visit Projects
    Then I get redirected to projects list page
    Then I search for project

    When I open actions menu
    When I select project
    Then I get success select

  Scenario: Edit Project
    Given Session Login
    Then Go Home

    Then Visit Projects
    Then I get redirected to projects list page
    Then I search for project

    When I open actions menu
    When I click on edit button
    Then I get redirected to project edit page
    Then I update project description
#    Then I uncheck checkboxes
    Then I click on update button
    Then I receive update success

  Scenario: View Project
    Given Session Login
    Then Go Home

    Then Visit Projects
    Then I get redirected to projects list page
    Then I search for project

    When I open actions menu
    When I click on view button
    Then I get redirected to project view page
    Then I read description


  Scenario: Delete Project
    Given Session Login
    Then Go Home

    Then Visit Projects
    Then I get redirected to projects list page
    Then I search for project

    When I open actions menu
    When I click on delete button
    Then I click yes button
    Then I get success delete