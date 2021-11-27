export interface CreateItemRequest {
  name: string;
  expireDate: string;
  productionDate: string;
  imageUri?: string;
  quantity: number;
  quantityUnit: string;
}
