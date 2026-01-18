export interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    uvIndex: number;
    visibility: number;
  };
  hourly: Array<{
    time: string;
    temperature: number;
    condition: string;
    icon: string;
    precipitationProbability: number;
  }>;
  daily: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    precipitationChance: number;
  }>;
  alerts: Array<{
    id: string;
    type: string;
    description: string;
    startTime: string;
    endTime: string;
  }>;
}
