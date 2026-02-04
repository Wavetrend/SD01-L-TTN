Feature: Uplink Debug Report Decoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description                                                          |
      | 0x00 0x00 0x00 0x00  | Timestamp                                                            |
      | 0xC2                 | PVD (5:7), Interval (1:4), Divide (0)                                |
      | 0x00 0x00            | S1: Temperature (0:10), Report (11), State (12:13) Direction (14:15) |
      | 0x00 0x00            | S2: Temperature (0:10), Report (11), State (12:13) Direction (14:15) |
      | 0x07 0xFF            | S3: Temperature (0:10), Report (11), State (12:13) Direction (14:15) |
      | 0x00 0x00            | S1: Temperature (0:10), Report (11), State (12:13) Direction (14:15) |
      | 0x00 0x00            | S2: Temperature (0:10), Report (11), State (12:13) Direction (14:15) |
      | 0x07 0xFF            | S3: Temperature (0:10), Report (11), State (12:13) Direction (14:15) |
    And the uplink port is 9
    And the decoded data has the structure:
    """
    {
      "timestamp": 0,
      "pvd_level": 6,
      "readings": [
        {
          "timestamp": -10,
          "sensors": [
            {
              "state": 0,
              "direction": 0,
              "report": false,
              "tempC": -27
            },
            {
              "state": 0,
              "direction": 0,
              "report": false,
              "tempC": -27
            },
            {
              "state": 0,
              "direction": 0,
              "report": false,
              "tempC": null
            }
          ]
        },
        {
          "timestamp": 0,
          "sensors": [
            {
              "state": 0,
              "direction": 0,
              "report": false,
              "tempC": -27
            },
            {
              "state": 0,
              "direction": 0,
              "report": false,
              "tempC": -27
            },
            {
              "state": 0,
              "direction": 0,
              "report": false,
              "tempC": null
            }
          ]
        }
      ]
    }
    """

  Scenario: base line decode
    When the uplink is decoded
    Then the decode is successful

