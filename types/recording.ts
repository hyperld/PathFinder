export interface Coordinate {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Recording {
  id: string;
  date: string;
  distance: number;
  duration: number;
  coordinates: Coordinate[];
  isFavourite: boolean;
}
