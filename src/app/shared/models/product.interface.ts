export interface IProduct {
  id: number;
  sku?: string;
  name: string;
  price: number;
  description?: string;
  profile?: {
    type?: ProductType;
    available?: boolean;
    backlog?: number;
    customProperties: ICustomProperty[]; 
  };
}

export interface ICustomProperty {
  key: string;
  value: string;
}

export type ProductType = 'furniture' | 'equipment' | 'stationary' | 'part';