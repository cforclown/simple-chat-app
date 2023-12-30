import { Router } from 'express';
import { RequestHandler, validateBody, validateParams } from 'cexpress-utils/lib';
import { sendMsgReqSchema, startConversationReqSchema } from 'chat-app.contracts';
import { MessagesController } from '.';
import { idSchema } from '../../schemas';

export const MESSAGES_ROUTER_INSTANCE_NAME = 'messagesRouter';
export const MESSAGES_BASE_API_PATH = 'messages';

export function MessagesRouter (messagesController: MessagesController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/v1/messages/{id}:
   *      post:
   *          tags:
   *              - Messages
   *          description: Get channel all messages
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
  router.get('/:id', validateParams(idSchema), RequestHandler(messagesController.getMsgs));

  /**
   * @swagger
   * /api/v1/messages/start:
   *      post:
   *          tags:
   *              - Messages
   *          description: Start a new conversation
   *          security:
   *              - Bearer: []
   *          responses:
   *              '200':
   *                  description: OK
   *          requestBody:
   *              description: "Start a new conversation payload"
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/startConversation'
   */
  router.post('/start', validateBody(startConversationReqSchema), RequestHandler(messagesController.startConversation));

  /**
   * @swagger
   * /api/v1/messages/{id}:
   *      put:
   *          tags:
   *              - Messages
   *          description: Send message
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
   *          requestBody:
   *              description: "Send message payload"
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/sendMsg'
   */
  router.put('/:id', validateParams(idSchema), validateBody(sendMsgReqSchema), RequestHandler(messagesController.sendMsg));

  /**
   * @swagger
   * /api/v1/messages/read/{id}:
   *      patch:
   *          tags:
   *              - Messages
   *          description: Read messages
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
  router.patch('/read/:id', validateParams(idSchema), RequestHandler(messagesController.readMsgs));

  return router;
}
