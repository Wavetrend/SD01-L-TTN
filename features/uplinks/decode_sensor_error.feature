Feature: Uplink Sensor Error Report Decoding

  Background:
    Given the encoded data has the structure:
      | Data | Description |
      | 0x00 | Sensor ID   |
    And the decoded data has the structure:
    """
    {
      "type": 5,
      "sensor_id": 0
    }
    """
    And the uplink port is 5

  Scenario: base line decode
    When the uplink is decoded
    Then the decode is successful

  Scenario Outline: Decodes for <Description>
    Given a sensor_id of <Sensor_ID>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Sensor_ID | Description |
      | 0         | Sensor 1    |
      | 1         | Sensor 2    |
      | 2         | Sensor 3    |
