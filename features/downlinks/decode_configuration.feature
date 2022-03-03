Feature: Decode Configuration

  Background:
    Given a configuration payload, version 3

  Scenario: Decodes base line configuration
    When the downlink decoder is called
    Then it should be decoded

  Scenario Outline: Decodes install request with sequence = <Sequence>
    Given a sequence of <Sequence>
    When the downlink decoder is called
    Then it should be decoded

    Examples:
      | Sequence  |
      | 0         |
      | 255       |

  Scenario Outline: Decodes install request with timestamp = <Timestamp>
    Given a timestamp of <Timestamp>
    When the downlink decoder is called
    Then it should be decoded

    Examples:
      | Timestamp  |
      | 0          |
      | 255        |
      | 305419896  |
      | 0xFFFFFFFF |

  Scenario Outline: Decodes install request with nonce = <Nonce>
    Given a nonce of <Nonce>
    When the downlink decoder is called
    Then it should be decoded

    Examples:
      | Nonce      |
      | 0          |
      | 255        |
      | 305419896  |
      | 0xFFFFFFFF |

