Feature: Uplink Install Response Decoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description              |
      | 0x02                 | Install Response Type    |
      | 0x01                 | Install Response Version |
      | 0x00                 | Sequence                 |
      | 0x00 0x00 0x00 0x00  | Timestamp                |
      | 0x00                 | Error Code               |
    And the decoded data has the structure:
    """
    {
      "type": 2,
      "version": 1,
      "sequence": 0,
      "timestamp": 0,
      "error_code": 0
    }
    """

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

  Scenario Outline: Decodes with <Description> error code (<Value>)
    Given a error_code of <Value>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Value | Description |
      | 0     | Minimum     |
      | 255   | Maximum     |
