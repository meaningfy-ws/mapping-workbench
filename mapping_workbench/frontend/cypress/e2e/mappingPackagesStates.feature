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

  Scenario: Xpath Reports
    Then I click on "Xpath" Reports Tab
    Then I receive Mapping Packages State "Xpath"
    Then I click on "Xpath" Data
    Then I receive Mapping Packages Suite "Xpath"
    Then I click on "Xpath" Data
    Then I receive Mapping Packages Test "Xpath"

  Scenario: Sparql Reports
    Then I click on "Sparql" Reports Tab
    Then I receive Mapping Packages State "Sparql"
    Then I click on "Sparql" Data
    Then I receive Mapping Packages Suite "Sparql"
    Then I click on "Sparql" Data
    Then I receive Mapping Packages Test "Sparql"

  Scenario: Shacl Reports
    Then I click on "Shacl" Reports Tab
    Then I receive Mapping Packages State "Shacl"
    Then I click on "Shacl" Data
    Then I receive Mapping Packages Suite "Shacl"
    Then I click on "Shacl" Data
    Then I receive Mapping Packages Test "Shacl"