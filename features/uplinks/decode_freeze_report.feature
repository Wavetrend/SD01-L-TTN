Feature: Uplink Freeze Report Decoding

  Background:
    Given the encoded data has the structure:
      | Data | Description |
      | 0x00 | Sensor ID   |
      | 0x00 | Temp C      |
    And the uplink port is 7
    And the decoded data has the structure:
    """
    {
      "sensor_id": 0,
      "temperature": 0
    }
    """

  Scenario: base line decode
    When the uplink is decoded
    Then the decode is successful

  Scenario Outline: Decodes with <Property> at <Description> (<Value>)
    Given a <Property> of <Value>
    When the uplink is decoded
    Then the decode is successful

    Examples:
      | Property    | Value | Description |
      | sensor_id   | 0     | Sensor 1    |
      | sensor_id   | 1     | Sensor 2    |
      | sensor_id   | 2     | Sensor 3    |
      | temperature | -27   | Minimum     |
      | temperature | 0     | Zero        |
      | temperature | 100   | Maximum     |
