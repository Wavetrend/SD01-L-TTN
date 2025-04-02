Feature: Uplink Debug Report Decoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description                                                          |
      | 0x00 0x00 0x00 0x00  | Timestamp                                                            |
      | 0xD0                 | PVD (0:2), Interval (3:6), Divide (7)                                |
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
      "pvd_level": 0,
      "readings": [
        {
          "timestamp": -1,
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

