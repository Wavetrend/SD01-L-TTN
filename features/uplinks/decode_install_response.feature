Feature: Uplink Install Response Decoding

  Scenario: A v1 installation response decodes from binary to JSON
    Given the uplink data is:
      | Data                 | Description              |
      | 0x02                 | Install Response Type    |
      | 0x01                 | Install Response Version |
      | 0x00                 | Sequence                 |
      | 0x00 0x00 0x00 0x00  | Timestamp                |
      | 0x00                 | Error Code               |
    When the uplink is decoded
    Then the v3 decoded output MUST match:
    """
    {
      "data": {
        "type": 2,
        "version": 1,
        "sequence": 0,
        "timestamp": 0,
        "error_code": 0
      },
      "warnings": [],
      "errors": []
    }
    """
    And the v2 decoded output MUST match:
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
    Given an installation response, version 1
    And a sequence of <Sequence>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Sequence  | Description |
      | 0         | Minimum     |
      | 255       | Maximum     |

  Scenario Outline: Decodes with <Description> timestamp (<Timestamp>)
    Given an installation response, version 1
    And a timestamp of <Timestamp>
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
    Given an installation response, version 1
    And a error_code of <Value>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Value | Description |
      | 0     | Minimum     |
      | 255   | Maximum     |
