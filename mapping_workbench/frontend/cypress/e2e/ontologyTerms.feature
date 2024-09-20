Feature: Ontology Terms

  As a valid user want to transform test data

  Background:
    Given Session Login
    Then Go Home
    Then I open side menu

#  Scenario: Select Project
#    Then I get redirected to projects list page
#    Then I search for project
#
#    When I select project
#    Then I get success select
#    Then I get redirected to projects list page

  Scenario: Discover Terms
    When I click on Ontology Terms
    Then I get redirected to Ontology Terms

    When I click on discover button
    Then I successfully add task for discover Ontology Terms

  Scenario: Add Ontology Terms
    When I click on Ontology Terms
    Then I get redirected to Ontology Terms

    When I click on add term button
    Then I get redirected to create page
    Then I enter name of Ontology Term
    Then I successfully create Ontology Terms

#  Scenario: Update Ontology Term
#    When I click on Ontology Terms
#    Then I get redirected to Ontology Terms
#
#    Then I search for Ontology Terms
#
#    Then I click edit button
#    Then I get redirected to edit page
#
#    When I enter updated name
#    Then I get success update

#  Scenario: View Ontology Term
#    When I click on Ontology Terms
#    Then I get redirected to Ontology Terms
#
#    Then I search for updated Ontology Terms
#
#    When I click on view button
#    Then I get redirected to view page
#    Then I receive Ontology Term data

  Scenario: Delete Ontology Term
    When I click on Ontology Terms
    Then I get redirected to Ontology Terms

    Then I search for Ontology Terms
    Then I click delete button
    Then I get success delete