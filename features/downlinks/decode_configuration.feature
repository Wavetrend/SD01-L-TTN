Feature: Downlink Configuration Decoding

  Background:
    Given a configuration payload, version 3

  Scenario: Decodes base line configuration
    When the downlink decoder is called
    Then it should be decoded

  Scenario Outline: Decodes with <Description> sequence (<Sequence>)
    Given a sequence of <Sequence>
    When the downlink decoder is called
    Then it should be decoded

    Examples:
    | Sequence  | Description |
    | 0         | Minimum     |
    | 255       | Maximum     |

  Scenario Outline: Decodes with <Description> timestamp (<Timestamp>)
    Given a timestamp of <Timestamp>
    When the downlink decoder is called
    Then it should be decoded

    Examples:
    | Timestamp  | Description                 |
    | 0          | Minimum                     |
    | 0xFF       | Maximum 8 bit value         |
    | 0xFFFF     | Maximum 16 bit value        |
    | 0xFFFFFF   | Maximum 24 bit value        |
    | 0xFFFFFFFF | Maximum 32 bit value        |

  Scenario Outline: Decodes with <Description> nonce (<Nonce>)
    Given a nonce of <Nonce>
    When the downlink decoder is called
    Then it should be decoded

    Examples:
    | Nonce      | Description                 |
    | 0          | Minimum                     |
    | 0xFF       | Maximum 8 bit value         |
    | 0xFFFF     | Maximum 16 bit value        |
    | 0xFFFFFF   | Maximum 24 bit value        |
    | 0xFFFFFFFF | Maximum 32 bit value        |

  Scenario Outline: Decodes with <Description> downlink hours (<Hours>)
    Given a downlink_hours of <Hours>
    When the downlink decoder is called
    Then it should be decoded

    Examples:
    | Hours | Description    |
    | 1     | Minimum        |
    | 24    | One Day        |
    | 255   | Maximum        |

  Scenario Outline: Decodes with <Flag> of <Description> (<Value>)
    Given a <Flag> of <Value>
    When the downlink decoder is called
    Then it should be decoded

    Examples:
    | Flag          | Value     | Description           |
    | scald         | true      | Enabled               |
    | freeze        | true      | Enabled               |
    | ambient       | true      | Enabled               |
    | debug         | true      | Enabled               |
    | history_count | 1         | 1 History             |
    | history_count | 2         | 2 Histories           |

  Scenario Outline: Decodes with <Description> <Threshold> (<Value>)
    Given a <Threshold> of <Value>
    When the downlink decoder is called
    Then it should be decoded

    Examples:
    | Threshold         | Value     | Description      |
    | scald_threshold   | -127      | Minimum          |
    | scald_threshold   | 0         | Zero             |
    | scald_threshold   | 127       | Maximum          |
    | freeze_threshold  | -127      | Minimum          |
    | freeze_threshold  | 0         | Zero             |
    | freeze_threshold  | 127       | Maximum          |

  Scenario Outline: Decodes with <Description> reporting period (<Period>)
    Given a reporting_period of <Period>
    When the downlink decoder is called
    Then it should be decoded

    Examples:
    | Period | Description          |
    | 0      | Minimum              |
    | 255    | Maximum 8 bit value  |
    | 65535  | Maximum 16 bit value |

  Scenario Outline: Decodes with sensor <Sensor>'s <Description> flow settling count (<Count>)
    Given a sensor <Sensor> flow_settling_count of <Count>
    When the downlink decoder is called
    Then it should be decoded

    Examples:
    | Sensor | Count | Description  |
    | 1      | 0     | Minimum      |
    | 1      | 15    | Maximum      |
    | 2      | 0     | Minimum      |
    | 2      | 15    | Maximum      |
    | 3      | 0     | Minimum      |
    | 3      | 15    | Maximum      |

  Scenario Outline: Decodes with sensor <Sensor>'s <Description> config type (<Config>)
    Given a sensor <Sensor> config_type of <Config>
    When the downlink decoder is called
    Then it should be decoded

    Examples:
      | Sensor | Config | Description                         |
      | 1      | 0      | Disabled                            |
      | 1      | 1      | Hot Outlet Standard                 |
      | 1      | 2      | Hot Outlet Healthcare               |
      | 1      | 3      | Cold Outlet                         |
      | 1      | 4      | Cold Outlet Rising                  |
      | 1      | 5      | Blended Rising Scald Check          |
      | 1      | 6      | Hot Unit Outlet Falling             |
      | 1      | 7      | Hot Unit Return Falling             |
      | 1      | 8      | Hot Unit Return Healthcare Falling  |
      | 2      | 0      | Disabled                            |
      | 2      | 1      | Hot Outlet Standard                 |
      | 2      | 2      | Hot Outlet Healthcare               |
      | 2      | 3      | Cold Outlet                         |
      | 2      | 4      | Cold Outlet Rising                  |
      | 2      | 5      | Blended Rising Scald Check          |
      | 2      | 6      | Hot Unit Outlet Falling             |
      | 2      | 7      | Hot Unit Return Falling             |
      | 2      | 8      | Hot Unit Return Healthcare Falling  |
      | 3      | 0      | Disabled                            |
      | 3      | 1      | Hot Outlet Standard                 |
      | 3      | 2      | Hot Outlet Healthcare               |
      | 3      | 3      | Cold Outlet                         |
      | 3      | 4      | Cold Outlet Rising                  |
      | 3      | 5      | Blended Rising Scald Check          |
      | 3      | 6      | Hot Unit Outlet Falling             |
      | 3      | 7      | Hot Unit Return Falling             |
      | 3      | 8      | Hot Unit Return Healthcare Falling  |
