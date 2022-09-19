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

  Scenario Outline: Decodes with PVD level <pvd>
    Given a pvd_level of <pvd>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | pvd        |
      | 0          |
      | 1          |
      | 2          |
      | 3          |
      | 4          |
      | 5          |
      | 6          |
      | 7          |

  Scenario Outline: Decodes with sensor <Sensor> status <Description> (<Status>)
    Given a sensor <Sensor> status of <Status>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Sensor | Status     | Description         |
      | 1      | 0          | Uninstalled         |
      | 1      | 1          | Installed           |
      | 2      | 0          | Uninstalled         |
      | 2      | 1          | Installed           |
      | 3      | 0          | Uninstalled         |
      | 3      | 1          | Installed           |

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

