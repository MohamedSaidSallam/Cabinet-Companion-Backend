import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { UpdateItemRequest } from "../../requests/UpdateItemRequest";
import { getUserId } from "../utils";
import { updateItem } from "../../helpers/businessLayer";
import { createLogger } from "../../utils/logger";

const logger = createLogger("updateItem");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.debug("event: ", event);

    const itemId = event.pathParameters.itemId;
    const updatedItem: UpdateItemRequest = JSON.parse(event.body);
    const userId = getUserId(event);

    await updateItem(itemId, userId, updatedItem);

    return {
      statusCode: 204,
      body: "",
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
