import { Router } from "express";
import ServiçosUsuário from "../serviços/serviços-usuário";
const RotasUsuário = Router();
export default RotasUsuário;
RotasUsuário.post("/login", ServiçosUsuário.logarUsuario);
RotasUsuário.post("/verificar-cpf/:cpf", ServiçosUsuário.verificarCpfExistente);