Feature: Decode Error Handling

  Background:
    Given the encoded data has the structure:
      | Data                 | Description              |

  Scenario Outline: Unsupported Payload type '<Description>' (<Port>) produces an error when decoding
    Given the downlink port is <Port>
    When the downlink is decoded
    Then the v3 decode errors with "<Description>"
    And the v2 decode is undefined

    Examples:
    | Port          | Description                               |
    | 0             | LoRaWAN reserved payload type             |
    | 1             | V1 Deprecated Payload, unsupported        |
    | 3             | Unrecognised type for downlink decoding   |
    | 128           | Unrecognised type for downlink decoding   |
    | 255           | Unrecognised type for downlink decoding   |

