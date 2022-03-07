Feature: Uplink Standard Report Decoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description                        |
      | 0x03                 | Standard Report Type               |
      | 0x01                 | Standard Report Version            |
      | 0x00                 | Sequence                           |
      | 0x00 0x00 0x00 0x00  | Timestamp                          |
      | 0x00                 | Sensor 1 MinC                      |
      | 0x00                 | Sensor 1 MaxC                      |
      | 0x00                 | Sensor 1 Event Count               |
      | 0x00                 | Sensor 1 Report Count              |
      | 0x00                 | Sensor 2 MinC                      |
      | 0x00                 | Sensor 2 MaxC                      |
      | 0x00                 | Sensor 2 Event Count               |
      | 0x00                 | Sensor 2 Report Count              |
      | 0x00                 | Sensor 3 MinC                      |
      | 0x00                 | Sensor 3 MaxC                      |
      | 0x00                 | Sensor 3 Event Count               |
      | 0x00                 | Sensor 3 Report Count              |
      | 0x00 0x00 0x00 0x00  | History 1 Timestamp                |
      | 0x00                 | History 1 Sensor 1 MinC            |
      | 0x00                 | History 1 Sensor 1 MaxC            |
      | 0x00                 | History 1 Sensor 1 Event Count     |
      | 0x00                 | History 1 Sensor 1 Report Count    |
      | 0x00                 | History 1 Sensor 2 MinC            |
      | 0x00                 | History 1 Sensor 2 MaxC            |
      | 0x00                 | History 1 Sensor 2 Event Count     |
      | 0x00                 | History 1 Sensor 2 Report Count    |
      | 0x00                 | History 1 Sensor 3 MinC            |
      | 0x00                 | History 1 Sensor 3 MaxC            |
      | 0x00                 | History 1 Sensor 3 Event Count     |
      | 0x00                 | History 1 Sensor 3 Report Count    |
      | 0x00 0x00 0x00 0x00  | History 2 Timestamp                |
      | 0x00                 | History 2 Sensor 1 MinC            |
      | 0x00                 | History 2 Sensor 1 MaxC            |
      | 0x00                 | History 2 Sensor 1 Event Count     |
      | 0x00                 | History 2 Sensor 1 Report Count    |
      | 0x00                 | History 2 Sensor 2 MinC            |
      | 0x00                 | History 2 Sensor 2 MaxC            |
      | 0x00                 | History 2 Sensor 2 Event Count     |
      | 0x00                 | History 2 Sensor 2 Report Count    |
      | 0x00                 | History 2 Sensor 3 MinC            |
      | 0x00                 | History 2 Sensor 3 MaxC            |
      | 0x00                 | History 2 Sensor 3 Event Count     |
      | 0x00                 | History 2 Sensor 3 Report Count    |
    And the decoded data has the structure:
    """
    {
      "type": 3,
      "version": 1,
      "sequence": 0,
      "timestamp": 0,
      "current": {
        "sensor": [
          {
            "minC": 0,
            "maxC": 0,
            "events": 0,
            "reports": 0
          },
          {
            "minC": 0,
            "maxC": 0,
            "events": 0,
            "reports": 0
          },
          {
            "minC": 0,
            "maxC": 0,
            "events": 0,
            "reports": 0
          }
        ]
      },
      "history": [
        {
          "timestamp": 0,
          "sensor": [
            {
              "minC": 0,
              "maxC": 0,
              "events": 0,
              "reports": 0
            },
            {
              "minC": 0,
              "maxC": 0,
              "events": 0,
              "reports": 0
            },
            {
              "minC": 0,
              "maxC": 0,
              "events": 0,
              "reports": 0
            }
          ]
        },
        {
          "timestamp": 0,
          "sensor": [
            {
              "minC": 0,
              "maxC": 0,
              "events": 0,
              "reports": 0
            },
            {
              "minC": 0,
              "maxC": 0,
              "events": 0,
              "reports": 0
            },
            {
              "minC": 0,
              "maxC": 0,
              "events": 0,
              "reports": 0
            }
          ]
        }
      ]
    }
    """

  Scenario: base line decode
    When the uplink is decoded
    Then the decode is successful

  Scenario Outline: Decodes with <Description> sequence (<Sequence>)
    Given a sequence of <Sequence>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Sequence  | Description |
      | 0         | Minimum     |
      | 255       | Maximum     |

  Scenario Outline: Decodes with <Description> timestamp (<Timestamp>)
    Given a timestamp of <Timestamp>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Timestamp  | Description                 |
      | 0          | Minimum                     |
      | 0xFF       | Maximum 8 bit value         |
      | 0xFFFF     | Maximum 16 bit value        |
      | 0xFFFFFF   | Maximum 24 bit value        |
      | 0xFFFFFFFF | Maximum 32 bit value        |

  Scenario Outline: Decodes with <Property> at <Description> (<Value>)
    Given a sensor <Sensor> <Property> of <Value>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Sensor | Property        | Value | Description |
      | 1      | CurrentMinC     | -27   | Minimum     |
      | 1      | CurrentMinC     | 0     | Zero        |
      | 1      | CurrentMinC     | 100   | Maximum     |
      | 1      | CurrentMaxC     | -27   | Minimum     |
      | 1      | CurrentMaxC     | 0     | Zero        |
      | 1      | CurrentMaxC     | 100   | Maximum     |
      | 1      | CurrentEvents   | 0     | Minimum     |
      | 1      | CurrentEvents   | 255   | Maximum     |
      | 1      | CurrentReports  | 0     | Minimum     |
      | 1      | CurrentReports  | 255   | Maximum     |
      | 2      | CurrentMinC     | -27   | Minimum     |
      | 2      | CurrentMinC     | 0     | Zero        |
      | 2      | CurrentMinC     | 100   | Maximum     |
      | 2      | CurrentMaxC     | -27   | Minimum     |
      | 2      | CurrentMaxC     | 0     | Zero        |
      | 2      | CurrentMaxC     | 100   | Maximum     |
      | 2      | CurrentEvents   | 0     | Minimum     |
      | 2      | CurrentEvents   | 255   | Maximum     |
      | 2      | CurrentReports  | 0     | Minimum     |
      | 2      | CurrentReports  | 255   | Maximum     |
      | 3      | CurrentMinC     | -27   | Minimum     |
      | 3      | CurrentMinC     | 0     | Zero        |
      | 3      | CurrentMinC     | 100   | Maximum     |
      | 3      | CurrentMaxC     | -27   | Minimum     |
      | 3      | CurrentMaxC     | 0     | Zero        |
      | 3      | CurrentMaxC     | 100   | Maximum     |
      | 3      | CurrentEvents   | 0     | Minimum     |
      | 3      | CurrentEvents   | 255   | Maximum     |
      | 3      | CurrentReports  | 0     | Minimum     |
      | 3      | CurrentReports  | 255   | Maximum     |
      | 1      | History1MinC    | -27   | Minimum     |
      | 1      | History1MinC    | 0     | Zero        |
      | 1      | History1MinC    | 100   | Maximum     |
      | 1      | History1MaxC    | -27   | Minimum     |
      | 1      | History1MaxC    | 0     | Zero        |
      | 1      | History1MaxC    | 100   | Maximum     |
      | 1      | History1Events  | 0     | Minimum     |
      | 1      | History1Events  | 255   | Maximum     |
      | 1      | History1Reports | 0     | Minimum     |
      | 1      | History1Reports | 255   | Maximum     |
      | 2      | History1MinC    | -27   | Minimum     |
      | 2      | History1MinC    | 0     | Zero        |
      | 2      | History1MinC    | 100   | Maximum     |
      | 2      | History1MaxC    | -27   | Minimum     |
      | 2      | History1MaxC    | 0     | Zero        |
      | 2      | History1MaxC    | 100   | Maximum     |
      | 2      | History1Events  | 0     | Minimum     |
      | 2      | History1Events  | 255   | Maximum     |
      | 2      | History1Reports | 0     | Minimum     |
      | 2      | History1Reports | 255   | Maximum     |
      | 3      | History1MinC    | -27   | Minimum     |
      | 3      | History1MinC    | 0     | Zero        |
      | 3      | History1MinC    | 100   | Maximum     |
      | 3      | History1MaxC    | -27   | Minimum     |
      | 3      | History1MaxC    | 0     | Zero        |
      | 3      | History1MaxC    | 100   | Maximum     |
      | 3      | History1Events  | 0     | Minimum     |
      | 3      | History1Events  | 255   | Maximum     |
      | 3      | History1Reports | 0     | Minimum     |
      | 3      | History1Reports | 255   | Maximum     |
      | 1      | History2MinC    | -27   | Minimum     |
      | 1      | History2MinC    | 0     | Zero        |
      | 1      | History2MinC    | 100   | Maximum     |
      | 1      | History2MaxC    | -27   | Minimum     |
      | 1      | History2MaxC    | 0     | Zero        |
      | 1      | History2MaxC    | 100   | Maximum     |
      | 1      | History2Events  | 0     | Minimum     |
      | 1      | History2Events  | 255   | Maximum     |
      | 1      | History2Reports | 0     | Minimum     |
      | 1      | History2Reports | 255   | Maximum     |
      | 2      | History2MinC    | -27   | Minimum     |
      | 2      | History2MinC    | 0     | Zero        |
      | 2      | History2MinC    | 100   | Maximum     |
      | 2      | History2MaxC    | -27   | Minimum     |
      | 2      | History2MaxC    | 0     | Zero        |
      | 2      | History2MaxC    | 100   | Maximum     |
      | 2      | History2Events  | 0     | Minimum     |
      | 2      | History2Events  | 255   | Maximum     |
      | 2      | History2Reports | 0     | Minimum     |
      | 2      | History2Reports | 255   | Maximum     |
      | 3      | History2MinC    | -27   | Minimum     |
      | 3      | History2MinC    | 0     | Zero        |
      | 3      | History2MinC    | 100   | Maximum     |
      | 3      | History2MaxC    | -27   | Minimum     |
      | 3      | History2MaxC    | 0     | Zero        |
      | 3      | History2MaxC    | 100   | Maximum     |
      | 3      | History2Events  | 0     | Minimum     |
      | 3      | History2Events  | 255   | Maximum     |
      | 3      | History2Reports | 0     | Minimum     |
      | 3      | History2Reports | 255   | Maximum     |

  Scenario Outline: Decodes with <Property> at <Description> (<Value>)
    Given a <Property> of <Value>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Property          | Value        | Description |
      | History1Timestamp | 0            | Minimum     |
      | History1Timestamp | 4294967295   | Maximum     |
      | History2Timestamp | 0            | Minimum     |
      | History2Timestamp | 4294967295   | Maximum     |

  Scenario Outline: Decodes with <Count> histories
    Given there are <Count> histories
    When the uplink is decoded
    Then the decode is successful

    Examples:
    | Count |
    | 0     |
    | 1     |
    | 2     |

