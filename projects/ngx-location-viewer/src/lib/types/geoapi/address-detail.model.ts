export interface AddressDetail {
  addressRegId: number;
  formattedAddress: string;
  addressPosition: AddressPosition;
}

export interface AddressPosition {
  lambert72: AddressPositionLambert72;
  wgs84: AddressPositionWgs84;
}

export interface AddressPositionWgs84 {
  lat: number;
  lon: number;
}

export interface AddressPositionLambert72 {
  x: number;
  y: number;
}
