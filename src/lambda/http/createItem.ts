import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { CreateItemRequest } from "../../requests/CreateItemRequest";
import { getUserId } from "../utils";
import { createItem } from "../../helpers/businessLayer";
import { createLogger } from "../../utils/logger";

const logger = createLogger("createItem");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.debug("event: ", event);

    const newItem: CreateItemRequest = JSON.parse(event.body);
    const userId = getUserId(event);

    const item = await createItem(newItem, userId);

    return {
      statusCode: 201,
      body: JSON.stringify({ item }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
