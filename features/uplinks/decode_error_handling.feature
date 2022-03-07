Feature: Decode Error Handling

  Background:
    Given the encoded data has the structure:
      | Data                 | Description              |
      | 0x00                 | Type                     |
      | 0x00                 | Version                  |
      | 0x00                 | Sequence                 |
      | 0x00 0x00 0x00 0x00  | Timestamp                |

  Scenario Outline: Unsupported Payload type <Description> (<Payload Type>) produces an error when decoding
    Given the payload type is <Payload Type>
    When the uplink is decoded
    Then the v3 decode errors with "Unsupported type for uplink decoding"
    And the v2 decode is null

    Examples:
      | Payload Type  | Description                     |
      | 1             | Configuration                   |
      | 7             | Low Battery Report - Deprecated |
      | 10            | Sensor Data Debug Report        |

  Scenario Outline: Invalid Payload Type <Payload Type> produces an error when decoded
    Given the payload type is <Payload Type>
    When the uplink is decoded
    Then the v3 decode errors with "Unrecognised type for uplink decoding"
    And the v2 decode is null

    Examples:
      | Payload Type |
      | 11           |
      | 12           |
      | 255          |

