Feature: Scenario Two

  As a valid user i run scenario two

  Scenario: Create Project
    Given Session Login
    Then Go Home

    When I expand Triple Maps
    Then I click on Generic Triple Maps
    Then I get redirected to generic triple maps fragments page

    When I click on upload fragment button
    Then I click select file
    Then I click on upload button
    Then I get success upload
    Then I search for triple map

    When I edit triple map fragment
    Then I click update and transform button
    Then I get success update triple map fragment
    And I get success transform triple map fragment