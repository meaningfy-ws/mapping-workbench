Feature: Fields And Nodes

  As a valid user want to interact with Fields And Nodes Page

  Background:
    Given Session Login
    Then Go Home

  Scenario: View Fields And Nodes
    When I click on Fields And Nodes
    Then I get redirected to Fields And Nodes
    And I receive Struct Tree
    And I receive Elements