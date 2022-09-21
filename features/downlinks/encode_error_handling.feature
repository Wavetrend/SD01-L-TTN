Feature: Encode Error Handling

  Background:
    Given the decoded data has the structure:
    """
    {
    }
    """

  Scenario Outline: Unsupported Payload type '<Description>' (<Port>) produces an error when encoding
    Given the downlink port is <Port>
    When the downlink is encoded
    Then the encode errors with "<Description>"

    Examples:
      | Port          | Description                               |
      | 0             | Unrecognised type for downlink decoding   |
      | 1             | Unrecognised type for downlink decoding   |
      | 3             | Unrecognised type for downlink decoding   |
      | 128           | Unrecognised type for downlink decoding   |
      | 255           | Unrecognised type for downlink decoding   |

