Feature: Ontology Files

  As a valid user want to interact with Ontology Files

  Background:
    Given Session Login
    Then Go Home
    When I open side menu

#  Scenario: Select Project
#    Then I select project
#    Then I get success select
#    Then I get redirected to overview page

  Scenario: Upload Ontology Files
    Then I click on Ontology Files
    Then I get redirected to Ontology Files

    When I click on upload button
    Then I select file to upload
    Then I click on ok upload button
    Then I get success upload

  Scenario: Delete Ontology Files
    Then I click on Ontology Files
    Then I get redirected to Ontology Files

    Then I search for Ontology Files
    Then I click delete button
    Then I get success delete