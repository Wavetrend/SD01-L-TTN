Feature: Decode Error Handling

  Background:
    Given the encoded data has the structure:
      | Data                 | Description              |

  Scenario Outline: Unsupported Payload type '<Description>' (<Port>) produces an error when decoding
    Given the uplink port is <Port>
    When the uplink is decoded
    Then the v3 decode errors with "Unsupported type for uplink decoding"
    And the v2 decode is null

    Examples:
      | Port          | Description                     |
      | 9             | Sensor Data Debug Report        |

