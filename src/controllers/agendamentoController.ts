import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const AgendamentosController = {
  // Criar um agendamento
  async criarAgendamento(req, res) {
    try {
      const { vendedorId, produtoId, dataEntrega } = req.body;
      const novoAgendamento = await prisma.agendamento.create({
        data: {
          vendedorId,
          produtoId,
          dataEntrega: new Date(dataEntrega),
        },
        include: { vendedor: true, produto: true },
      });
      res.status(201).json(novoAgendamento);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar agendamento", detalhes: error.message });
    }
  },

  // Buscar todos os agendamentos
  async listarAgendamentos(req, res) {
    try {
      const agendamentos = await prisma.agendamento.findMany({
        include: { vendedor: true, produto: true },
      });
      res.status(200).json(agendamentos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar agendamentos", detalhes: error.message });
    }
  },

  // Atualizar um agendamento
  async atualizarAgendamento(req, res) {
    try {
      const { id } = req.params;
      const { vendedorId, produtoId, dataEntrega } = req.body;
      const agendamentoAtualizado = await prisma.agendamento.update({
        where: { id: Number(id) },
        data: {
          vendedorId,
          produtoId,
          dataEntrega: new Date(dataEntrega),
        },
        include: { vendedor: true, produto: true },
      });
      res.status(200).json(agendamentoAtualizado);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar agendamento", detalhes: error.message });
    }
  },

  // Excluir um agendamento
  async excluirAgendamento(req, res) {
    try {
      const { id } = req.params;
      await prisma.agendamento.delete({
        where: { id: Number(id) },
      });
      res.status(200).json({ message: "Agendamento excluído com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir agendamento", detalhes: error.message });
    }
  },
};
