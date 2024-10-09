Feature: Mapping Packages States

  As a valid use i want to interact with Mapping Packages States

  Background:
    Given Session Login
    Then Go Home
    Then I open side menu
    Then I go to Mapping Packages
    Then I get redirected to Mapping Packages list page
    Then I search for Mapping Package
    Then I click on View Last State
    Then I receive Mapping Packages State

  Scenario Outline: <tab_name> Reports
    Then I click on "<tab_name>" Reports Tab
    Then I receive Mapping Packages State "<tab_name>"
    Then I click on "<tab_name>" Data
    Then I receive Mapping Packages Suite "<tab_name>"
    Then I click on "<tab_name>" Data
    Then I receive Mapping Packages Test "<tab_name>"
    Examples:
    | tab_name |
    | Xpath |
    | Sparql |
    | Shacl |