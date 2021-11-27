export interface Item {
  userId: string;
  itemId: string;
  createdAt: string;
  name: string;
  expireDate: string;
  productionDate: string;
  imageUri?: string;
  quantity: number;
  quantityUnit: string;
}
