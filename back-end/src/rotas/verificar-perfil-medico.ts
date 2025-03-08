import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilMedico from "../middlewares/verificar-perfil-medico";
import ServiçosMedico from "../serviços/serviços-medico";
const RotasMedico = Router();
export default RotasMedico;
RotasMedico.post("/", ServiçosMedico.cadastrarMedico);
RotasMedico.get("/:cpf", verificarToken, verificarPerfilMedico,
ServiçosMedico.buscarMedico);