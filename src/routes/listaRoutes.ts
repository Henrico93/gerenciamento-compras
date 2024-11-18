import express from "express";
import { ListasController } from "../controllers/listaController";

const router = express.Router();

router.post("/", ListasController.criarLista);
router.get("/", ListasController.listarListas);
router.put("/:id", ListasController.atualizarLista);
router.delete("/:id", ListasController.excluirLista);

export default router;
