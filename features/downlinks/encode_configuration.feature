Feature: Encode Configuration

  Background:
    Given a configuration, version 3

  Scenario: Encode base line Configuration
    When the downlink encoder is called
    Then it should be encoded

  Scenario Outline: Encodes Configuration with timestamp = <Timestamp>
    Given a timestamp of <Timestamp>
    When the downlink encoder is called
    Then it should be encoded

    Examples:
      | Timestamp  |
      | 0          |
      | 255        |
      | 305419896  |
      | 0xFFFFFFFF |

  Scenario Outline: Encode Configuration with sequence = <Sequence>
    Given a sequence of <Sequence>
    When the downlink encoder is called
    Then it should be encoded

    Examples:
      | Sequence  |
      | 0         |
      | 255       |
