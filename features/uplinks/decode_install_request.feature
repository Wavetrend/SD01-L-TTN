Feature: Decode Install Request

  Background:
    Given An installation request payload, version 4

  Scenario: Decodes base line install request
    When the uplink decoder is called
    Then it should be decoded

  Scenario Outline: Decodes install request with sequence = <Sequence>
    Given a sequence of <Sequence>
    When the uplink decoder is called
    Then it should be decoded

    Examples:
    | Sequence  |
    | 0         |
    | 255       |

  Scenario Outline: Decodes install request with timestamp = <Timestamp>
    Given a timestamp of <Timestamp>
    When the uplink decoder is called
    Then it should be decoded

    Examples:
      | Timestamp  |
      | 0          |
      | 255        |
      | 305419896  |
      | 0xFFFFFFFF |

  Scenario Outline: Decodes install request with nonce = <Nonce>
    Given a nonce of <Nonce>
    When the uplink decoder is called
    Then it should be decoded

    Examples:
      | Nonce      |
      | 0          |
      | 255        |
      | 305419896  |
      | 0xFFFFFFFF |

  Scenario Outline: Decodes install request with battery_Mv = <mV>
    Given a battery_mV of <mV>
    When the uplink decoder is called
    Then it should be decoded

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

  Scenario Outline: Decodes install request with sensor <Sensor> temperature = <tempC>
    Given a sensor <Sensor> temperature of <tempC>
    When the uplink decoder is called
    Then it should be decoded

    Examples:
      | Sensor | tempC      |
      | 1      | -27        |
      | 1      | 0          |
      | 1      | 20         |
      | 1      | 100        |
      | 1      | null       |
      | 2      | -27        |
      | 2      | 0          |
      | 2      | 20         |
      | 2      | 100        |
      | 3      | null       |
      | 3      | -27        |
      | 3      | 0          |
      | 3      | 20         |
      | 3      | 100        |
      | 3      | null       |
