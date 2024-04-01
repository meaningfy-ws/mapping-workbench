Feature: Remove Triple Maps

  As a valid use i want to see package
  Scenario: Delete Packages
    Given Session Login
    Then Go Home
    Then Check home title
    Then Go Triple Maps
    Then Check Triple Map url
    And I delete fragment
    And I receive delete projects success
