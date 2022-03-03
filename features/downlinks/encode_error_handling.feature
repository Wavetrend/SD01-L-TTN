Feature: Encode Error Handling

  Scenario Outline: Unsupported Payload type <Description> (<Payload Type>) produces an error when encoding
    Given an empty payload header
    And the payload type is <Payload Type>
    When the downlink is encoded
    Then the encode errors with "Unsupported type for downlink encoding"

    Examples:
      | Payload Type  | Description                     |
      | 0             | Install Request                 |
      | 2             | Install Response                |
      | 3             | Standard Report                 |
      | 4             | Ambient Report                  |
      | 5             | Scald Report                    |
      | 6             | Freeze Report                   |
      | 7             | Low Battery Report - Deprecated |
      | 8             | Sensor Error Report             |
      | 9             | General Error Report            |
      | 10            | Sensor Data Debug Report        |

  Scenario Outline: Invalid Payload Type <Payload Type> produces an error when decoded
    Given an empty payload header
    And the payload type is <Payload Type>
    When the downlink is encoded
    Then the encode errors with "Unrecognised type for downlink encoding"

    Examples:
      | Payload Type |
      | 11           |
      | 12           |
      | 255          |