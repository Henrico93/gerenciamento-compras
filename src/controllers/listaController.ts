import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ListasController = {
  // Criar uma nova lista
  async criarLista(req, res) {
    try {
      const { nome, descricao, produtos } = req.body;
      const novaLista = await prisma.lista.create({
        data: {
          nome,
          descricao,
          produtos: {
            connect: produtos.map((produtoId) => ({ id: produtoId })),
          },
        },
        include: { produtos: true },
      });
      res.status(201).json(novaLista);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar lista", detalhes: error.message });
    }
  },

  // Buscar todas as listas
  async listarListas(req, res) {
    try {
      const listas = await prisma.lista.findMany({
        include: { produtos: true },
      });
      res.status(200).json(listas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar listas", detalhes: error.message });
    }
  },

  // Atualizar uma lista
  async atualizarLista(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, produtos } = req.body;
      const listaAtualizada = await prisma.lista.update({
        where: { id: Number(id) },
        data: {
          nome,
          descricao,
          produtos: {
            set: produtos.map((produtoId) => ({ id: produtoId })),
          },
        },
        include: { produtos: true },
      });
      res.status(200).json(listaAtualizada);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar lista", detalhes: error.message });
    }
  },

  // Excluir uma lista
  async excluirLista(req, res) {
    try {
      const { id } = req.params;
      await prisma.lista.delete({
        where: { id: Number(id) },
      });
      res.status(200).json({ message: "Lista excluída com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir lista", detalhes: error.message });
    }
  },
};
