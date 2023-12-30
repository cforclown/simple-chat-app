import { explorationSwaggerSchemas, paginationSwagger } from 'cexpress-utils/lib';
import { authSwagger, channelsSwagger, messagesSwagger, usersSwagger } from 'chat-app.contracts';

const schemas = Object.assign(
  { ...explorationSwaggerSchemas },
  { ...paginationSwagger },
  { ...authSwagger },
  { ...usersSwagger },
  { ...channelsSwagger },
  { ...messagesSwagger }
);

export default schemas;
