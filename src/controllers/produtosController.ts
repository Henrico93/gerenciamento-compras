import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProduto = async (req, res) => {
  const { nome, descricao, categoriaId } = req.body;

  try {
    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        categoriaId: Number(categoriaId),
      },
    });
    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto', details: error.message });
  }
};

export const getProdutos = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: { categoria: true },
    });
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos', details: error.message });
  }
};

export const updateProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, categoriaId } = req.body;

  try {
    const produtoAtualizado = await prisma.produto.update({
      where: { id: Number(id) },
      data: {
        nome,
        descricao,
        categoriaId: Number(categoriaId),
      },
    });
    res.status(200).json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto', details: error.message });
  }
};

export const deleteProduto = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.produto.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar produto', details: error.message });
  }
};
