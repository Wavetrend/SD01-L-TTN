Feature: Uplink General Error Report Decoding

  Background:
    Given the encoded data has the structure:
      | Data      | Description |
      | 0x00 0x00 | Error Code  |
      | 0x00 0x00 | File Hash   |
      | 0x00 0x00 | Line        |
    And the uplink port is 6
    And the decoded data has the structure:
    """
    {
      "type": 6,
      "error_code": 0,
      "file_hash": 0,
      "line": 0
    }
    """

  Scenario: base line decode
    When the uplink is decoded
    Then the decode is successful

  Scenario Outline: Decodes with <Property> at <Description> (<Value>)
    Given a <Property> of <Value>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Property   | Value | Description |
      | error_code | 0     | Minimum     |
      | error_code | 65535 | Maximum     |
      | file_hash  | 0     | Minimum     |
      | file_hash  | 65535 | Maximum     |
      | line       | 0     | Minimum     |
      | line       | 65535 | Maximum     |

