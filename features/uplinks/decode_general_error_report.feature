Feature: Uplink General Error Report Decoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description                    |
      | 0x09                 | General Error Report Type      |
      | 0x00                 | General Error Report Version   |
      | 0x00                 | Sequence                       |
      | 0x00 0x00 0x00 0x00  | Timestamp                      |
      | 0x00 0x00            | Error Code                     |
      | 0x00 0x00 0x00 0x00  | Filename                       |
      | 0x00 0x00 0x00 0x00  | Filename                       |
      | 0x00 0x00 0x00 0x00  | Filename                       |
      | 0x00 0x00 0x00 0x00  | Filename                       |
      | 0x00 0x00 0x00 0x00  | Filename                       |
      | 0x00 0x00 0x00 0x00  | Filename                       |
      | 0x00 0x00 0x00 0x00  | Filename                       |
      | 0x00 0x00 0x00 0x00  | Filename                       |
      | 0x00 0x00            | Line                           |
    And the decoded data has the structure:
    """
    {
      "type": 9,
      "version": 0,
      "sequence": 0,
      "timestamp": 0,
      "error_code": 0,
      "file": "",
      "line": 0
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
      | Property     | Value | Description |
      | error_code   | 0     | Minimum     |
      | error_code   | 65535 | Maximum     |
      | line         | 0     | Minimum     |
      | line         | 65535 | Maximum     |

  Scenario Outline: Decodes with file of <Description> ("<File>")
    Given a file of "<File>"
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | File                             | Description    |
      |                                  | Empty          |
      | foo.bar                          | Typical        |
      | 123456789+123456789+123456789+12 | Maximum Length |
