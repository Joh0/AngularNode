export interface MenuItem {
    id: number;
    item: string;
    'price ($)': number; // Key with spaces or special characters must be in quotes
    'calories (kCal)': number;
  }