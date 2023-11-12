import { Router } from "express";
import logger from "../utils/logger.js";

const routerLoggerTest = Router();

routerLoggerTest.get("/", (req, res) => {
    logger.fatal("Esto es un logger de fatal");
    logger.error("Esto es un logger de error");
    logger.warn("Esto es un logger de warn");
    logger.info("Esto es un logger de info");
    logger.http("Esto es un logger de http");
    logger.debug("Esto es un logger de debug");
    res.send("OK: Loggers successfully loaded");
});

export default routerLoggerTest;