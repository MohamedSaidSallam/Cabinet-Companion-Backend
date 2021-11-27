export interface UpdateItemRequest {
  name: string;
  expireDate: string;
  productionDate: string;
  imageUri?: string;
  quantity: number;
  quantityUnit: string;
}
