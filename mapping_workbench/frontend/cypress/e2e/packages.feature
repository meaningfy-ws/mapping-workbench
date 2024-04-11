Feature: Entry Packages

  As a valid use i want to see package
  Scenario: Import Packages
#    Given Session Login
#    Then Go Home
#    Then I go to packages
#    Then I get redirected to mapping_packages list page
#    When I click on packages import
#    Then I click select file
#    Then I click on upload button
#    Then I get success upload
#
#  Scenario: View Pacakges
#    Given Session Login
#    Then Go Home
#    Then I go to packages
#    Then I get redirected to mapping_packages list page
#    Then I receive packages
#    When I expand first package details

  Scenario: Create Packages
    Given Session Login
    Then Go Home
    Then I go to packages
    Then I get redirected to mapping_packages list page
    When I click on add packages button
    Then I get redirected to mapping_packages create page
    Then I enter name and id
    Then I click on submit button
    Then I get success create


  Scenario: Update Package
    Given Session Login
    Then Go Home
    Then I go to packages
    Then I get redirected to mapping_packages list page
    Then I search for package
    Then I edit package
    Then I update name
    Then I click on submit button
    Then I get success update

    Scenario: Delete Package
    Given Session Login
    Then Go Home
    Then I go to packages
    Then I get redirected to mapping_packages list page
    Then I search for updated package
    When I delete package
    Then I click yes
    Then I get success delete