import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createVendedor = async (req, res) => {
  const { nome, email, cpf, produtos } = req.body;

  try {
    const novoVendedor = await prisma.vendedor.create({
      data: {
        nome,
        email,
        cpf,
        produtos: {
          connect: produtos.map((id) => ({ id: Number(id) })),
        },
      },
    });
    res.status(201).json(novoVendedor);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar vendedor', details: error.message });
  }
};

export const getVendedores = async (req, res) => {
  try {
    const vendedores = await prisma.vendedor.findMany({
      include: { produtos: true },
    });
    res.status(200).json(vendedores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar vendedores', details: error.message });
  }
};

export const updateVendedor = async (req, res) => {
  const { id } = req.params;
  const { nome, email, cpf, produtos } = req.body;

  try {
    const vendedorAtualizado = await prisma.vendedor.update({
      where: { id: Number(id) },
      data: {
        nome,
        email,
        cpf,
        produtos: {
          set: produtos.map((id) => ({ id: Number(id) })),
        },
      },
    });
    res.status(200).json(vendedorAtualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar vendedor', details: error.message });
  }
};

export const deleteVendedor = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.vendedor.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar vendedor', details: error.message });
  }
};
