import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import { getUserId } from "../utils";
import { deleteItem } from "../../helpers/businessLayer";
import { createLogger } from "../../utils/logger";

const logger = createLogger("deleteItem");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.debug("event: ", event);

    const itemId = event.pathParameters.itemId;
    const userId = getUserId(event);

    await deleteItem(itemId, userId);

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
