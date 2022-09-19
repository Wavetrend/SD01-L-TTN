Feature: Uplink Install Request Decoding

  Background:
    Given the encoded data has the structure:
      | Data                 | Description                                 |
      | 0x00                 | PVD:[3-5]=0, S3:[2]=0, S2:[1]=0, S1:[0]=0   |
      | 0x00                 | Firmware Version Major                      |
      | 0x00                 | Firmware Version Minor                      |
      | 0x00 0x00            | Reset Reason                                |
    And the uplink port is 2
    And the decoded data has the structure:
    """
    {
      "type": 2,
      "pvd_level": 0,
      "sensor": [
        false, false, false
      ],
      "firmware_version": {
        "major": 0,
        "minor": 0
      },
      "reset_reason": 0
    }
    """

  Scenario: Decodes base line
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

  Scenario Outline: Decodes with <Description> nonce (<Nonce>)
    Given a nonce of <Nonce>
    When the uplink is decoded
    Then the decode is successful

    Examples:
    | Nonce      | Description                 |
    | 0          | Minimum                     |
    | 0xFF       | Maximum 8 bit value         |
    | 0xFFFF     | Maximum 16 bit value        |
    | 0xFFFFFF   | Maximum 24 bit value        |
    | 0xFFFFFFFF | Maximum 32 bit value        |

  Scenario Outline: Decodes with Battery Level at <mV> millivolts
    Given a battery_mV of <mV>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | mV         |
      | 1850       |
      | 2040       |
      | 2240       |
      | 2440       |
      | 2640       |
      | 2830       |
      | 3050       |
      | 3300       |
      | 3600       |

  Scenario Outline: Decodes with sensor <Sensor> <Description> temperature (<tempC>)
    Given a sensor <Sensor> temperature of <tempC>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Sensor | tempC      | Description         |
      | 1      | -27        | Minimum             |
      | 1      | -21.5      | Negative Decimal    |
      | 1      | 0          | Zero                |
      | 1      | 20         | Positive Integer    |
      | 1      | 21.5       | Positive Decimal    |
      | 1      | 100        | Maximum             |
      | 1      | null       | No Value            |
      | 2      | -27        | Minimum             |
      | 2      | -21.5      | Negative Decimal    |
      | 2      | 0          | Zero                |
      | 2      | 20         | Positive Integer    |
      | 2      | 21.5       | Positive Decimal    |
      | 2      | 100        | Maximum             |
      | 2      | null       | No Value            |
      | 3      | -27        | Minimum             |
      | 3      | -21.5      | Negative Decimal    |
      | 3      | 0          | Zero                |
      | 3      | 20         | Positive Integer    |
      | 3      | 21.5       | Positive Decimal    |
      | 3      | 100        | Maximum             |
      | 3      | null       | No Value            |

  Scenario Outline: Decodes with <Description> firmware.major (<Version>)
    Given a firmware_version.major of <Version>
    When the uplink is decoded
    Then the decode is successful

    Examples:
    | Version | Description |
    | 0       | Minimum     |
    | 255     | Maximum     |

  Scenario Outline: Decodes with <Description> firmware.minor (<Version>)
    Given a firmware_version.minor of <Version>
    When the uplink is decoded
    Then the decode is successful

    Examples:
    | Version | Description |
    | 0       | Minimum     |
    | 255     | Maximum     |

  Scenario Outline: Decodes with <Description> firmware.build (<Version>)
    Given a firmware_version.build of <Version>
    When the uplink is decoded
    Then the decode is successful

    Examples:
    | Version   | Description    |
    | 0         | Minimum        |
    | 255       | Maximum 8 bit  |
    | 65535     | Maximum 16 bit |

  Scenario Outline: Decodes with <Description> reset_reason (<Reason>)
    Given a reset_reason of <Reason>
    When the uplink is decoded
    Then the decode is successful

    Examples:
    | Reason    | Description          |
    | 0         | Minimum              |
    | 255       | Maximum 8 bit value  |
    | 65535     | Maximum 16 bit value |

