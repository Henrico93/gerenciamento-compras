import express from "express";
import listasRoutes from "../routes/listaRoutes";
import agendamentosRoutes from "../routes/agendamentoRoutes";
import produtosRoutes from "../routes/produtoRoutes";
import categoriasRoutes from "../routes/categoriaRoutes";
import vendedoresRoutes from "../routes/vendedorRoutes";

const app = express();
app.use(express.json());

// Rotas
app.use("/listas", listasRoutes);
app.use("/agendamentos", agendamentosRoutes);
app.use("/produtos", produtosRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/vendedores", vendedoresRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
