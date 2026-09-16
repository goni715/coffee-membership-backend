import express from 'express';
import FaqController from './faq.controller';
import authMiddleware from '@/middlewares/authMiddleware';
import { USER_ROLES } from '../user/user.constant';
import validationMiddleware from '@/middlewares/validationMiddleware';
import { createFaqValidationSchema, deleteFaqValidationSchema, updateFaqValidationSchema } from './faq.validation';

const router = express.Router();

router.post(
    '/create-faq',
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validationMiddleware(createFaqValidationSchema),
    FaqController.createFaq,
);
router.get(
    '/faqs',
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    FaqController.getFaqs
);
router.get(
    '/user-faqs',
    authMiddleware(USER_ROLES.CUSTOMER, USER_ROLES.OWNER),
    FaqController.getUserFaqs
);
router.patch(
    '/update-faq/:faqId',
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validationMiddleware(updateFaqValidationSchema),
    FaqController.updateFaq,
);
router.delete(
    '/delete-faq/:faqId',
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validationMiddleware(deleteFaqValidationSchema),
    FaqController.deleteFaq,
);


const FaqRoutes = router;
export default FaqRoutes;