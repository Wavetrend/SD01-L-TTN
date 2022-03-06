Feature: Downlink Configuration Encoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description              |
      | 0x01                 | Configuration Type       |
      | 0x03                 | Configuration Version    |
      | 0x00                 | Sequence                 |
      | 0x00 0x00 0x00 0x00  | Timestamp                |
      | 0x00 0x00 0x00 0x00  | Nonce                    |
      | 0x00                 | Downlink Hours           |
      | 0x00                 | Message Flags            |
      | 0x00                 | Scald Threshold          |
      | 0x00                 | Freeze Threshold         |
      | 0x00 0x00            | Reporting Period         |
      | 0x00                 | Sensor 1 Config          |
      | 0x00                 | Sensor 2 Config          |
      | 0x00                 | Sensor 3 Config          |
    And the decoded data has the structure:
    """
    {
      "type": 1,
      "version": 3,
      "sequence": 0,
      "timestamp": 0,
      "nonce": 0,
      "downlink_hours": 0,
      "message_flags": {
          "scald": false,
          "freeze": false,
          "ambient": false,
          "debug": false,
          "history_count": 0
      },
      "scald_threshold": 0,
      "freeze_threshold": 0,
      "reporting_period": 0,
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

  Scenario: Encodes base line Configuration
    When the downlink is encoded
    Then the encode is successful

  Scenario Outline: Encodes with <Description> timestamp (<Timestamp>)
    Given a timestamp of <Timestamp>
    When the downlink is encoded
    Then the encode is successful

    Examples:
      | Timestamp  | Description                 |
      | 0          | Minimum                     |
      | 0xFF       | Maximum 8 bit value         |
      | 0xFFFF     | Maximum 16 bit value        |
      | 0xFFFFFF   | Maximum 24 bit value        |
      | 0xFFFFFFFF | Maximum 32 bit value        |

  Scenario Outline: Encodes with <Description> sequence (<Sequence>)
    Given a sequence of <Sequence>
    When the downlink is encoded
    Then the encode is successful

    Examples:
      | Sequence  | Description |
      | 0         | Minimum     |
      | 255       | Maximum     |
