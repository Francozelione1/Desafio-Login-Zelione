import { Router } from "express";
import cartRouter from "./cart.routes.js";
import productRouter from "./products.routes.js";
import sessionRouter from "./sessions.routes.js";
import userRouter from "./users.routes.js";
import routerTicket from "./ticket.routes.js";
import { routerFaker } from "./faker.routes.js";
import routerLoggerTest from "./logger.routes.js";

const router = Router()

router.get('/static/cargarJuegosForm', (req, res) => {
	
	res.render('cargarJuegosForm', {
		rutaCSS: 'realTimeProducts',
		rutaJS: 'cargarJuegosForm',

	});
});

router.get('/static/:cid', (req, res) => {
	const {cid} = req.params
	console.log(cid);
	res.render('home', {
		rutaCSS: 'realTimeProducts',
		rutaJS: 'cargarJuegosSegunCarrito',
		cid
	});
});


router.use('/api/products', productRouter)
router.use('/api/users', userRouter)
router.use('/api/carts', cartRouter)
router.use('/api/sessions', sessionRouter)
router.use('/api/tickets', routerTicket)
router.use('/api/faker', routerFaker)
router.use('/api/loggerTest', routerLoggerTest)

export default router