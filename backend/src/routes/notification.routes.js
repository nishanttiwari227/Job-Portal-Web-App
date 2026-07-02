import { Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  idValidationRules,
  listNotificationsValidationRules,
} from '../validators/notification.validator.js';
import {
  listNotificationsHandler,
  markNotificationReadHandler,
  markAllNotificationsReadHandler,
} from '../controllers/notification.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', listNotificationsValidationRules, validate, listNotificationsHandler);
router.patch('/:id/read', idValidationRules, validate, markNotificationReadHandler);
router.patch('/read-all', markAllNotificationsReadHandler);

export default router;
