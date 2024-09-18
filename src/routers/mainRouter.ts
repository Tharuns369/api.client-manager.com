import { Hono } from "hono";
import invoicesRouter from "./invoicesRoutes";
import clientsRouter from "./clientRouters";
import servicesRouter from "./servicesRoutes";
import userRouter from "./userRoutes";


const  router = new Hono();


router.route('/invoices', invoicesRouter);
router.route('/clients', clientsRouter);
router.route('/services', servicesRouter);
router.route('/user', userRouter);


export default router;