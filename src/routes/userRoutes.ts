import { Router } from "express";
import { UserController } from "../controller/userController";

const router = Router();
const userController = new UserController();

// Configuração das rotas direcionando para as funções do Controller
router.post("/", userController.create);
router.get("/", userController.list);
router.get("/:id", userController.show);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

export default router;