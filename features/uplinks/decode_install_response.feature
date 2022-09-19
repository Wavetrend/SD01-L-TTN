Feature: Uplink Install Response Decoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description              |
      | 0x00                 | Error Code               |
    And the uplink port is 4
    And the decoded data has the structure:
    """
    {
      "type": 4,
      "error_code": 0
    }
    """

  Scenario Outline: Decodes with <Description> error code (<Value>)
    Given a error_code of <Value>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Value | Description |
      | 0     | Minimum     |
      | 255   | Maximum     |
