Feature: Encode Error Handling

  Background:
    Given the decoded data has the structure:
    """
    {
      "type": 0,
      "version": 0,
      "sequence": 0,
      "timestamp": 0
    }
    """

  Scenario Outline: Unsupported Payload type <Description> (<Payload Type>) produces an error when encoding
    Given the payload type is <Payload Type>
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
    Given the payload type is <Payload Type>
    When the downlink is encoded
    Then the encode errors with "Unrecognised type for downlink encoding"

    Examples:
      | Payload Type |
      | 11           |
      | 12           |
      | 255          |
    
  Scenario Outline: Unsupported configuration version <Version>
    Given the payload type is 1
    And the payload version is <Version>
    When the downlink is encoded
    Then the v3 encode errors with "Unsupported configuration version <Version>"

    Examples:
    | Version |
    | 0       |
    | 1       |
    | 2       |
    | 4       |