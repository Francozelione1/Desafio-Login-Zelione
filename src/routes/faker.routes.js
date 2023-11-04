import { Router } from "express";
import { generar100Productos } from "../controllers/faker.controller.js";
import { passportError, authorization } from "../utils/messageErrors.js";

export const routerFaker = Router()

routerFaker.get("/mockingProducts", authorization("admin"), generar100Productos) // GENERA 100 PRODUCTOS // SOLO ADMIN




