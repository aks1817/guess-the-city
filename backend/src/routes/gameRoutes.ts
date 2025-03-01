import express from "express";
import { getNewGame, seedDestinations } from "../controllers/gameController";

const router = express.Router();

router.get("/new", getNewGame);

router.post("/seed", seedDestinations);

export default router;
