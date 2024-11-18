import express from "express";
import { AgendamentosController } from "../controllers/agendamentoController";

const router = express.Router();

router.post("/", AgendamentosController.criarAgendamento);
router.get("/", AgendamentosController.listarAgendamentos);
router.put("/:id", AgendamentosController.atualizarAgendamento);
router.delete("/:id", AgendamentosController.excluirAgendamento);

export default router;
