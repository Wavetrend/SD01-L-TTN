Feature: Uplink Simple Report Decoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description                        |
      | 0x00 0x00 0x00 0x00  | Timestamp                          |
      | 0x00                 | Sensor 0 MinC                      |
      | 0x00                 | Sensor 0 MaxC                      |
      | 0x00                 | Sensor 1 MinC                      |
      | 0x00                 | Sensor 1 MaxC                      |
      | 0x00                 | Sensor 2 MinC                      |
      | 0x00                 | Sensor 2 MaxC                      |
    And the uplink port is 10
    And the decoded data has the structure:
    """
    {
      "timestamp": 0,
      "s1MinC": 0,
      "s1MaxC": 0,
      "s2MinC": 0,
      "s2MaxC": 0,
      "s3MinC": 0,
      "s3MaxC": 0
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

