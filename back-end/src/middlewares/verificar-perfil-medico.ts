import { Perfil } from "../entidades/usuario";
export default function verificarPerfilMedico(request, response, next) {
if (request.perfil === Perfil.MEDICO) return next();
else return response.status(401).json({ erro: "Acesso não autorizado." });
};