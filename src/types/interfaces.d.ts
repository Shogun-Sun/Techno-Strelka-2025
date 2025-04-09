export interface OfficeService {
  id: string;
  name: string;
}

export interface Office {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  services: OfficeService[];
}
