import * as uuid from "uuid";
import * as dataLayer from "./dataLayer";
import { CreateItemRequest } from "../requests/CreateItemRequest";
import { Item } from "../models/ItemCreate";
import { ItemUpdate } from "../models/ItemUpdate";
import { attachmentS3Bucket, getUploadUrl } from "./attachmentUtils";

export async function getItems(currentUserId: string): Promise<Item[]> {
  return dataLayer.getItems(currentUserId);
}

export async function createItem(
  newItem: CreateItemRequest,
  userId: string
): Promise<Item> {
  return await dataLayer.createItem({
    userId: userId,
    itemId: uuid.v4(),
    createdAt: new Date().toISOString(),
    ...newItem,
  });
}

export async function updateItem(
  itemId: string,
  userId: string,
  updatedItem: ItemUpdate
): Promise<any> {
  return await dataLayer.updateItem(itemId, userId, updatedItem);
}

export async function deleteItem(itemId: string, userId: string): Promise<any> {
  return dataLayer.deleteItem(itemId, userId);
}

export async function createAttachmentPresignedUrl(
  itemId: string,
  userId: string
) {
  const imageId = uuid.v4();

  const uploadUrl = getUploadUrl(imageId);

  await dataLayer.setAttachmentUrl(
    itemId,
    userId,
    `https://${attachmentS3Bucket}.s3.amazonaws.com/${imageId}`
  );
  return uploadUrl;
}
