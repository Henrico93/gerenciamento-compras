import express from "express";
import { createCategoria, getCategorias, updateCategoria, deleteCategoria } from "../controllers/categoriaController.js";

const router = express.Router();

// Rotas de Categorias
router.post("/", createCategoria);
router.get("/", getCategorias);
router.put("/:id", updateCategoria);
router.delete("/:id", deleteCategoria);

export default router;
