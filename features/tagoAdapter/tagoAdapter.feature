Feature: TagO Adapter

Background:
  Given the decoded data has the structure:
  """
  {
    "type": 3,
    "timestamp": 0,
    "sensor_id": 0,
    "minC": 0,
    "maxC": 0,
    "events": 0,
    "reports": 0
  }
  """
  And the TagO output has the structure:
  """
  [
    {
      "variable": "type",
      "value": "3",
      "serie": "1"
    },
    {
      "variable": "timestamp",
      "value": "0",
      "serie": "1"
    },
    {
      "variable": "s1_minC",
      "value": "0",
      "serie": "1"
    },
    {
      "variable": "s1_maxC",
      "value": "0",
      "serie": "1"
    },
    {
      "variable": "s1_events",
      "value": "0",
      "serie": "1"
    },
    {
      "variable": "s1_reports",
      "value": "0",
      "serie": "1"
    }
  ]
  """

Scenario Outline: Converts Standard Reports with <Description>
  Given the TagO <Property> has the value <Value>
  When the TagO adapter transforms
  Then the TagO transform is successful

  Examples:
    | Property     | Value        | Description               |
    | timestamp    | 0            | Minimum timestamp         |
    | timestamp    | 4294967295   | Maximum timestamp         |
    | sensor_id    | 0            | Sensor 1                  |
    | sensor_id    | 1            | Sensor 2                  |
    | sensor_id    | 2            | Sensor 3                  |
    | minC         | -27          | Minimum MinC              |
    | minC         | 0            | Zero MinC                 |
    | minC         | 100          | Maximum MinC              |
    | maxC         | -27          | Minimum MaxC              |
    | maxC         | 0            | Zero MaxC                 |
    | maxC         | 100          | Maximum MaxC              |
    | events       | 0            | Minimum Events            |
    | events       | 255          | Maximum Events            |
    | reports      | 0            | Minimum Reports           |
    | reports      | 255          | Maximum Reports           |

Scenario: Skips standard reports with invalid readings
  Given the TagO minC has the value 127
  And the TagO maxC has the value -128
  When the TagO adapter transforms
  Then the TagO transform is unsuccessful

