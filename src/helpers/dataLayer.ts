import * as AWS from "aws-sdk";
const AWSXRay = require("aws-xray-sdk");
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { Item } from "../models/ItemCreate";
import { ItemUpdate } from "../models/ItemUpdate";

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger("dataLayer");

const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient();
const cabinetCompanionTable = process.env.CABINET_COMPANION_TABLE;
const cabinetCompanionIndexName =
  process.env.CABINET_COMPANION_CREATED_AT_INDEX;

export const getItems = async (userId: string): Promise<Item[]> => {
  logger.debug(`getItems (userId: ${userId})`);

  const result = await docClient
    .query({
      TableName: cabinetCompanionTable,
      IndexName: cabinetCompanionIndexName,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    })
    .promise();

  return result.Items as Item[];
};

export const createItem = async (item: Item): Promise<Item> => {
  logger.debug(`createItem (item: ${item})`);

  await docClient
    .put({
      TableName: cabinetCompanionTable,
      Item: item,
    })
    .promise();

  return item;
};

export async function updateItem(
  itemId: string,
  userId: string,
  updatedItem: ItemUpdate
) {
  logger.debug(`updateItem (itemId: ${itemId}, updatedItem: ${updatedItem})`);

  await docClient
    .update({
      TableName: cabinetCompanionTable,
      Key: { itemId: itemId, userId: userId },
      ExpressionAttributeNames: { "#name": "name" },
      UpdateExpression:
        "set #name = :name, expireDate = :expireDate, productionDate = :productionDate, quantity = :quantity, quantityUnit = :quantityUnit",
      ExpressionAttributeValues: {
        ":name": updatedItem.name,
        ":expireDate": updatedItem.expireDate,
        ":productionDate": updatedItem.productionDate,
        ":quantity": updatedItem.quantity,
        ":quantityUnit": updatedItem.quantityUnit,
      },
      ReturnValues: "UPDATED_NEW",
    })
    .promise();
}

export async function setAttachmentUrl(
  itemId: string,
  userId: string,
  url: string
) {
  logger.debug(`setAttachmentUrl (itemId: ${itemId}, url: ${url})`);

  await docClient
    .update({
      TableName: cabinetCompanionTable,
      Key: { itemId: itemId, userId: userId },
      UpdateExpression: "set imageUri = :imageUri",
      ExpressionAttributeValues: {
        ":imageUri": url,
      },
    })
    .promise();
}

export async function deleteItem(itemId: string, userId: string) {
  logger.debug(`deleteItem (itemId: ${itemId})`);

  await docClient
    .delete({
      TableName: cabinetCompanionTable,
      Key: { itemId: itemId, userId: userId },
    })
    .promise();
}
