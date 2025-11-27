import { Router } from 'express';
import { userController } from './user.controller.js';
import { validate } from '../../middlewares/validation.middleware.js';
import { createUserSchema, updateUserSchema, getUserSchema } from './user.dto.js';

const router = Router();

router.post('/', validate(createUserSchema), userController.create);
router.get('/', userController.findAll);
router.get('/:id', validate(getUserSchema), userController.findById);
router.patch('/:id', validate(updateUserSchema), userController.update);
router.delete('/:id', validate(getUserSchema), userController.delete);

export default router;
