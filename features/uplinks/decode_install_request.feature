Feature: Decode Install Request

  Scenario: Decodes base line install request
    Given An installation request, version 4
    When the uplink decoder is called
    Then it should be decoded

  Scenario Outline: Decodes install request with sequences
    Given An installation request, version 4
    And has a sequence of <Sequence>
    When the uplink decoder is called
    Then it should be decoded

    Examples:
    | Sequence  |
    | 0         |
    | 255       |

  Scenario Outline: Decodes install request with timestamps
    Given An installation request, version 4
    And has a timestamp of <Timestamp>
    When the uplink decoder is called
    Then it should be decoded

    Examples:
      | Timestamp |
      | 0         |
      | 255       |
      | 305419896 |

  Scenario Outline: Decodes install request with nonces
    Given An installation request, version 4
    And has a nonce of <Nonce>
    When the uplink decoder is called
    Then it should be decoded

    Examples:
      | Nonce     |
      | 0         |
      | 255       |
      | 305419896 |