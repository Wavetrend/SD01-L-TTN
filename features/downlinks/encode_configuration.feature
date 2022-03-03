Feature: Downlink Configuration Encoding

  Background:
    Given a configuration payload, version 3

  Scenario: Encodes base line Configuration
    When the downlink is encoded
    Then the encode is successful

  Scenario Outline: Encodes with <Description> timestamp (<Timestamp>)
    Given a timestamp of <Timestamp>
    When the downlink is encoded
    Then the encode is successful

    Examples:
      | Timestamp  | Description                 |
      | 0          | Minimum                     |
      | 0xFF       | Maximum 8 bit value         |
      | 0xFFFF     | Maximum 16 bit value        |
      | 0xFFFFFF   | Maximum 24 bit value        |
      | 0xFFFFFFFF | Maximum 32 bit value        |

  Scenario Outline: Encodes with <Description> sequence (<Sequence>)
    Given a sequence of <Sequence>
    When the downlink is encoded
    Then the encode is successful

    Examples:
      | Sequence  | Description |
      | 0         | Minimum     |
      | 255       | Maximum     |
