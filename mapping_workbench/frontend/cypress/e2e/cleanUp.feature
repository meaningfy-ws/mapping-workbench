Feature: Entry Packages

  As a valid use i want to see package
  Scenario: Delete Packages
    Given Session Login
    Then Go Home
    Then Check home title
    Then I receive projects
    And I delete test project
