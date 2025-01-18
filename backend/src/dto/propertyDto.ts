export class PropertyDto {
  owner: string;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  sqft: number;
  imageUrl: string;
  ammenities: string;
}

export class PropertyDescDto {
  name: string;
  location: string;
  price: string;
  bedrooms: string;
  sqft: number;
  ammenities: string;
}

export class PropertyComparisonDto {
  id: number;
  owner: string;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  sqft: number;
  imageUrl: string;
  ammenities: string;
  address: string;
}
