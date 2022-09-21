Feature: Uplink Standard Report Decoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description                        |
      | 0x00 0x00 0x00 0x00  | Timestamp                          |
      | 0x00                 | Sensor ID                          |
      | 0x00                 | Sensor MinC                        |
      | 0x00                 | Sensor MaxC                        |
      | 0x00                 | Sensor Event Count                 |
      | 0x00                 | Sensor Report Count                |
    And the uplink port is 3
    And the decoded data has the structure:
    """
    {
      "type": 3,
      "timestamp": 0,
      "sensor_id": 0,
      "minC": 0,
      "maxC": 0,
      "events": 0,
      "reports": 0
    }
    """

  Scenario: base line decode
    When the uplink is decoded
    Then the decode is successful

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
      | Property  | Value | Description |
      | sensor_id | 0     | Sensor 1    |
      | sensor_id | 1     | Sensor 2    |
      | sensor_id | 2     | Sensor 3    |
      | MinC      | -27   | Minimum     |
      | MinC      | 0     | Zero        |
      | MinC      | 100   | Maximum     |
      | MaxC      | -27   | Minimum     |
      | MaxC      | 0     | Zero        |
      | MaxC      | 100   | Maximum     |
      | Events    | 0     | Minimum     |
      | Events    | 255   | Maximum     |
      | Reports   | 0     | Minimum     |
      | Reports   | 255   | Maximum     |


