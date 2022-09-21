Feature: Downlink Configuration Encoding

  Background:
    Given the encoded data has the structure:
      | Data      | Description                        |
      | 0x00      | Downlink Hours                     |
      | 0x00 0x00 | Reporting Period                   |
      | 0x00      | Message Flags                      |
      | 0x00      | Scald Threshold                    |
      | 0x00      | Freeze Threshold                   |
      | 0x00      | Sensor 1 Config (flow 0, config 0) |
      | 0x00      | Sensor 2 Config (flow 0, config 0) |
      | 0x00      | Sensor 3 Config (flow 0, config 0) |
    And the decoded data has the structure:
    """
    {
      "type": 2,
      "downlink_hours": 0,
      "reporting_period": 0,
      "message_flags": {
          "scald": false,
          "freeze": false,
          "debug": false,
          "history_count": 0
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
    And the downlink port is 2

  Scenario: Encodes base line Configuration
    When the downlink is encoded
    Then the encode is successful

  Scenario Outline: Encodes with <Description> <Property> of <Value>
    Given a <Property> of <Value>
    When the downlink is encoded
    Then the encode is successful

    Examples:
      | Property            | Value | Description |
      | downlink_hours      | 0     | Minimum     |
      | downlink_hours      | 255   | Maximum     |
      | reporting_period    | 0     | Minimum     |
      | reporting_period    | 65535 | Maximum     |
      | scald               | 0     | Disabled    |
      | scald               | 1     | Enabled     |
      | freeze              | 0     | Disabled    |
      | freeze              | 1     | Enabled     |
      | debug               | 0     | Disabled    |
      | debug               | 1     | Enabled     |
      | history_count       | 0     | Minimum     |
      | history_count       | 2     | Maximum     |
      | scald_threshold     | -127  | Minimum     |
      | scald_threshold     | 0     | Zero        |
      | scald_threshold     | 128   | Maximum     |
      | freeze_threshold    | -127  | Minimum     |
      | freeze_threshold    | 0     | Zero        |
      | freeze_threshold    | 128   | Maximum     |

  Scenario Outline: Encodes with sensor <Sensor> <Description> <Property> of <Value>
    Given a sensor <Sensor> <Property> of <Value>
    When the downlink is encoded
    Then the encode is successful

    Examples:
      | Sensor | Property            | Value | Description |
      | 1      | flow_settling_count | 0     | Minimum     |
      | 1      | flow_settling_count | 15    | Maximum     |
      | 2      | flow_settling_count | 0     | Minimum     |
      | 2      | flow_settling_count | 15    | Maximum     |
      | 3      | flow_settling_count | 0     | Minimum     |
      | 3      | flow_settling_count | 15    | Maximum     |
      | 1      | config_type         | 0     | Minimum     |
      | 1      | config_type         | 15    | Maximum     |
      | 2      | config_type         | 0     | Minimum     |
      | 2      | config_type         | 15    | Maximum     |
      | 3      | config_type         | 0     | Minimum     |
      | 3      | config_type         | 15    | Maximum     |
