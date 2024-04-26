import {blue, green, indigo, purple, yellow} from './colors';

export const getPrimary = (preset) => {
  switch (preset) {
    case 'blue':
      return blue;
    case 'green':
      return green;
    case 'indigo':
      return indigo;
    case 'purple':
      return purple;
    case 'yellow':
       return yellow;
    default:
      console.error('Invalid color preset, accepted values: "yellow", "blue", "green", "indigo" or "purple"".');
      return yellow;
  }
};
