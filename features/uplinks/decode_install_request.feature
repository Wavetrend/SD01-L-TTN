Feature: Decode Install Request

  Background:
    Given An installation request, version 4

  Scenario: Decodes base line install request
    When the uplink decoder is called
    Then it should be decoded

  Scenario Outline: Decodes install request with sequence = <Sequence>
    Given a sequence of <Sequence>
    When the uplink decoder is called
    Then it should be decoded

    Examples:
    | Sequence  |
    | 0         |
    | 255       |

  Scenario Outline: Decodes install request with timestamp = <Timestamp>
    Given a timestamp of <Timestamp>
    When the uplink decoder is called
    Then it should be decoded

    Examples:
      | Timestamp  |
      | 0          |
      | 255        |
      | 305419896  |
      | 0xFFFFFFFF |

  Scenario Outline: Decodes install request with nonce = <Nonce>
    Given a nonce of <Nonce>
    When the uplink decoder is called
    Then it should be decoded

    Examples:
      | Nonce      |
      | 0          |
      | 255        |
      | 305419896  |
      | 0xFFFFFFFF |
