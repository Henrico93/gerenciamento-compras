import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: { produtos: true },
    });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias.' });
  }
};

export const createCategoria = async (req, res) => {
  const { nome } = req.body;
  try {
    const novaCategoria = await prisma.categoria.create({ data: { nome } });
    res.status(201).json(novaCategoria);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar categoria.' });
  }
};

export const updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  try {
    const categoriaAtualizada = await prisma.categoria.update({
      where: { id: Number(id) },
      data: { nome },
    });
    res.json(categoriaAtualizada);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar categoria.' });
  }
};

export const deleteCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.categoria.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar categoria.' });
  }
};
