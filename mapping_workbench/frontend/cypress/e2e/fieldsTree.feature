Feature: Fields Tree

  As a valid user want to interact with Fields Tree

  Background:
    Given Session Login
    Then Go Home
    Then I open side menu

  Scenario: View Fields Tree
    When I click on Fields Tree
    Then I get redirected to Fields Tree
    Then I receive Fields Tree
