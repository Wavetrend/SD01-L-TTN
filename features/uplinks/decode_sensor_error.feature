Feature: Uplink Sensor Error Report Decoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description                    |
      | 0x08                 | Sensor Error Report Type       |
      | 0x00                 | Sensor Error Report Version    |
      | 0x00                 | Sequence                       |
      | 0x00 0x00 0x00 0x00  | Timestamp                      |
      | 0x00                 | Sensor 1                       |
      | 0x00                 | Sensor 2                       |
      | 0x00                 | Sensor 3                       |
    And the decoded data has the structure:
    """
    {
      "type": 8,
      "version": 0,
      "sequence": 0,
      "timestamp": 0,
      "sensor": [ 0, 0, 0 ]
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
    Given a sensor <Sensor> <Property> of <Value>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Sensor | Property | Value | Description |
      | 1      | sensor   | 0     | Minimum     |
      | 1      | sensor   | 255   | Maximum     |
      | 2      | sensor   | 0     | Minimum     |
      | 2      | sensor   | 255   | Maximum     |
      | 3      | sensor   | 0     | Minimum     |
      | 3      | sensor   | 255   | Maximum     |
