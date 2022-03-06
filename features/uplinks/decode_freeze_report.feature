Feature: Uplink Freeze Report Decoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description              |
      | 0x06                 | Freeze Report Type       |
      | 0x00                 | Freeze Report Version    |
      | 0x00                 | Sequence                 |
      | 0x00 0x00 0x00 0x00  | Timestamp                |
      | 0x00                 | Sensor ID                |
      | 0x00                 | Temp C                   |
    And the decoded data has the structure:
    """
    {
      "type": 6,
      "version": 0,
      "sequence": 0,
      "timestamp": 0,
      "sensor": 0,
      "temperature": 0
    }
    """

  Scenario: base line decode
    When the uplink is decoded
    Then the decode is successful

  Scenario Outline: Decodes with <Description> sequence (<Sequence>)
    Given a sequence of <Sequence>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Sequence  | Description |
      | 0         | Minimum     |
      | 255       | Maximum     |

  Scenario Outline: Decodes with <Description> timestamp (<Timestamp>)
    Given a timestamp of <Timestamp>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Timestamp  | Description                 |
      | 0          | Minimum                     |
      | 0xFF       | Maximum 8 bit value         |
      | 0xFFFF     | Maximum 16 bit value        |
      | 0xFFFFFF   | Maximum 24 bit value        |
      | 0xFFFFFFFF | Maximum 32 bit value        |

  Scenario Outline: Decodes with <Property> at <Description> (<Value>)
    Given a <Property> of <Value>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Property    | Value | Description |
      | sensor      | 0     | Minimum     |
      | sensor      | 255   | Maximum     |
      | temperature | -27   | Minimum     |
      | temperature | 0     | Zero        |
      | temperature | 100   | Maximum     |
