Feature: Entry Packages

  As a valid use i want to see package
  Scenario: Delete Packages
    Given Session Login
    Then Go Home
    Then Check home title

    Then I click on account button
    Then I select project setup

    When I click on delete button
    Then I click yes button
    Then I get success delete