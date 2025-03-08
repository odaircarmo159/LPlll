import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuario";
import ServicosUsuario from "./serviços-usuário";
import Medico from "../entidades/medico";

export default class ServicosMedico {
  constructor() {}

  static async cadastrarMedico(request, response) {
    try {
      const { usuario_info, universidade_formacao, especialidade } =
        request.body;
      if (!usuario_info || Object.keys(usuario_info).length === 0) {
        throw new Error("Dados do usuário não fornecidos");
      }
      const { usuario, token } = await ServicosUsuario.cadastrarUsuario(
        usuario_info
      );
      const entityManager = getManager();

      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuario);
        const medico = Medico.create({
          usuario,
          universidade_formacao,
          especialidade,
        });
        await transactionManager.save(medico);
        await transactionManager.update(Usuário, usuario.cpf, {
          status: Status.ATIVO,
        });
      });
      return response.json({ status: Status.ATIVO, token });
    } catch (error) {
      return response.status(500).json({ erro: error.message });
    }
  }

  static async buscarMedico(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const medico = await Medico.findOne({
        where: { usuario: cpf_encriptado },
        relations: ["usuario"],
      });

      if (!medico)
        return response.status(404).json({ erro: "Médico não encontrado." });

      return response.json({
        nome: medico.usuario.nome,
        email: medico.usuario.email,
        universidade_formacao: medico.universidade_formacao,
        especialidade: medico.especialidade,
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD: buscarMedico" });
    }
  }
}
