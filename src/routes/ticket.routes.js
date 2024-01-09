import { Router } from "express";
import { passportError, authorization } from "../utils/messageErrors.js";
import { finalizarCompra } from "../controllers/tickets.controller.js";

const routerTicket = Router()

//routerTicket.get("/:cid/finalizarCompra", passportError('jwt'), authorization('user') ,finalizarCompra) // FINALIZA LA COMPRA

export default routerTicket