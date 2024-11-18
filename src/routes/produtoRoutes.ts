import express from "express";
import { createProduto, getProdutos, updateProduto, deleteProduto } from "../controllers/produtosController";

const router = express.Router();

// Rotas de Produtos
router.post("/", createProduto); // Criar produto
router.get("/", getProdutos); // Listar produtos
router.put("/:id", updateProduto); // Atualizar produto
router.delete("/:id", deleteProduto); // Deletar produto

export default router;
