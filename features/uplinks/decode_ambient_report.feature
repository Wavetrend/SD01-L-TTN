Feature: Uplink Ambient Report Decoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description              |
      | 0x04                 | Ambient Report Type      |
      | 0x00                 | Ambient Report Version   |
      | 0x00                 | Sequence                 |
      | 0x00 0x00 0x00 0x00  | Timestamp                |
      | 0x00                 | Minimum Temp C           |
      | 0x00                 | Maximum Temp C           |
      | 0x00                 | Average Temp C           |
    And the decoded data has the structure:
    """
    {
      "type": 4,
      "version": 0,
      "sequence": 0,
      "timestamp": 0,
      "minC": 0,
      "maxC": 0,
      "avgC": 0
    }
    """

  Scenario: Ambient base line decode
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
    | Property | Value | Description |
    | minC     | -27   | Minimum     |
    | minC     | 0     | Zero        |
    | minC     | 100   | Maximum     |
    | maxC     | -27   | Minimum     |
    | maxC     | 0     | Zero        |
    | maxC     | 100   | Maximum     |
    | avgC     | -27   | Minimum     |
    | avgC     | 0     | Zero        |
    | avgC     | 100   | Maximum     |