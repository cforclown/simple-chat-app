import { Router } from 'express';
import { RequestHandler, validateBody, validateParams } from 'cexpress-utils/lib';
import { createGroupReqSchema, updateGroupReqSchema } from 'chat-app.contracts';
import { ChannelsController } from '..';
import { idSchema } from '../../schemas';

export const CHANNELS_ROUTER_INSTANCE_NAME = 'channelsRouter';
export const CHANNELS_BASE_API_PATH = 'channels';

export function ChannelsRouter (channelsController: ChannelsController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/v1/channels/{id}:
   *      get:
   *          tags:
   *              - Channels
   *          description: Get channel details
   *          security:
   *              - Bearer: []
   *          responses:
   *              '200':
   *                  description: OK
   *          parameters:
   *              -   name: id
   *                  in: path
   *                  description: Channel id
   *                  required: true
   */
  router.get('/:id', validateParams(idSchema), RequestHandler(channelsController.get));

  /**
   * @swagger
   * /api/v1/channels:
   *      get:
   *          tags:
   *              - Channels
   *          description: Get all user channels
   *          security:
   *              - Bearer: []
   *          responses:
   *              '200':
   *                  description: OK
   */
  router.get('/', RequestHandler(channelsController.getUserChannels));

  /**
   * @swagger
   * /api/v1/channels/group:
   *      post:
   *          tags:
   *              - Channels
   *          description: Create group
   *          security:
   *              - Bearer: []
   *          responses:
   *              '200':
   *                  description: OK
   *          requestBody:
   *              description: "Create group"
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/createGroup'
   */
  router.post('/group', validateBody(createGroupReqSchema), RequestHandler(channelsController.createGroup));

  /**
   * @swagger
   * /api/v1/channels/group{id}:
   *      patch:
   *          tags:
   *              - Channels
   *          description: Update group
   *          security:
   *              - Bearer: []
   *          responses:
   *              '200':
   *                  description: OK
   *          requestBody:
   *              description: "Update group payload"
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/upgradeGroup'
   */
  router.patch('/group/:id', validateParams(idSchema), validateBody(updateGroupReqSchema), RequestHandler(channelsController.updateGroup));

  /**
   * @swagger
   * /api/v1/channels/{id}:
   *      delete:
   *          tags:
   *              - Channels
   *          description: Delete channel
   *          security:
   *              - Bearer: []
   *          responses:
   *              '200':
   *                  description: OK
   *          parameters:
   *              -   name: id
   *                  in: path
   *                  required: true
   */
  router.delete('/:id', validateParams(idSchema), RequestHandler(channelsController.delete));

  return router;
}
