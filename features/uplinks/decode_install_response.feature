Feature: Uplink Install Response Decoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description              |
      | 0x00                 | Error Code               |
      | 0x00                 | Downlink Hours           |
      | 0x00 0x00            | Reporting Period         |
      | 0x00                 | Message Flags            |
      | 0x00                 | Scald Threshold          |
      | 0x00                 | Freeze Threshold         |
      | 0x00                 | Sensor 1 Config          |
      | 0x00                 | Sensor 2 Config          |
      | 0x00                 | Sensor 3 Config          |
    And the uplink port is 4
    And the decoded data has the structure:
    """
    {
      "error_code": 0,
      "downlink_hours": 0,
      "reporting_period": 0,
      "message_flags": {
          "scald": false,
          "freeze": false,
          "debug": false,
          "history_count": 0,
          "simple": false,
          "act_poll": false,
          "stat_poll": false
      },
      "scald_threshold": 0,
      "freeze_threshold": 0,
      "config_type": [
          {
              "flow_settling_count": 0,
              "config": 0
          },
          {
              "flow_settling_count": 0,
              "config": 0
          },
          {
              "flow_settling_count": 0,
              "config": 0
          }
      ]
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
