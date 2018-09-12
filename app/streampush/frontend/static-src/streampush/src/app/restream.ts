import { Endpoint } from './endpoint';

export interface Restream {
  id: string;
  name: string;
  owner: number;
  live: boolean;
  endpoints: Endpoint[];

  selected: boolean;
}
