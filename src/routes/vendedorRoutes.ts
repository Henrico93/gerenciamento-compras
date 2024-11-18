import express from "express";
import { createVendedor, getVendedores, updateVendedor, deleteVendedor } from "../controllers/vendedorController";

const router = express.Router();

// Rotas de Vendedores
router.post("/", createVendedor);
router.get("/", getVendedores);
router.put("/:id", updateVendedor);
router.delete("/:id", deleteVendedor);

export default router;
