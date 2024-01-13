import { Router } from '../services/errors/customRouter.js';
import { userController } from '../controllers/index.js';
import { documentsUploader } from '../middlewares/multer.js';

const router = Router();

router.get('/', userController.getAllUsers);

router.delete('/', userController.cleanInactiveUsers);

router.get('/premium/:uid', userController.premiumSwith);

router.post(
    '/:uid/documents',
    documentsUploader.any(),
    userController.uploadDocuments
);

export default router;
