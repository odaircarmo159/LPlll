import bcrypt from "bcrypt";
import dotenv from "dotenv";
import md5 from "md5";
import { sign } from "jsonwebtoken";
import Usuario, { Perfil } from "../entidades/usuario";
import Medico from "../entidades/medico";
import Paciente from "../entidades/paciente";
dotenv.config();
const SALT = 10;
const SENHA_JWT = process.env.SENHA_JWT;
export default class ServicosUsuario {
  constructor() {}
  static async verificarCpfExistente(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const usuario = await Usuario.findOne(cpf_encriptado);
      if (usuario) {
        return response.status(409).json({ erro: "CPF já cadastrado." });
      } else {
        return response.status(200).json({ mensagem: "CPF disponível." });
      }
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD: verificarCpfCadastrado" });
    }
  }
  static async verificarCadastroCompleto(usuario: Usuario) {
    switch (usuario.perfil) {
      case Perfil.MEDICO:
        const medico = await Medico.findOne({
          where: { usuario: { cpf: usuario.cpf } },
          relations: ["usuario"],
        });
        if (!medico) return false;
        return true;
      case Perfil.PACIENTE:
        const paciente = await Paciente.findOne({
          where: { usuario: { cpf: usuario.cpf } },
          relations: ["usuario"],
        });
        if (!paciente) return false;
        return true;
      default:
        return;
    }
  }

  static async logarUsuario(request, response) {
    try {
      const { nome_login, senha } = request.body;
      const cpf_encriptado = md5(nome_login);
      const usuario = await Usuario.findOne(cpf_encriptado);
      if (!usuario)
        return response
          .status(404)
          .json({ erro: "Nome de usuário não cadastrado." });
      const cadastro_completo = await ServicosUsuario.verificarCadastroCompleto(
        usuario
      );
      if (!cadastro_completo) {
        await Usuario.remove(usuario);
        return response.status(400).json({
          erro: "Cadastro incompleto. Por favor, realize o cadastro novamente.",
        });
      }
      const senha_correta = await bcrypt.compare(senha, usuario.senha);
      if (!senha_correta)
        return response.status(401).json({ erro: "Senha incorreta." });
      const token = sign(
        { perfil: usuario.perfil, email: usuario.email },
        SENHA_JWT,
        { subject: usuario.nome, expiresIn: "1d" }
      );
      return response.json({
        usuarioLogado: {
          nome: usuario.nome,
          perfil: usuario.perfil,
          email: usuario.email,
          questao: usuario.questao,
          status: usuario.status,
          cor_tema: usuario.cor_tema,
          token,
        },
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD: logarUsuario" });
    }
  }
  static async cadastrarUsuario(usuario_informado) {
    try {
      const { cpf, nome, perfil, email, senha, questao, resposta, cor_tema } =
        usuario_informado;
      const cpf_encriptado = md5(cpf);
      const senha_encriptada = await bcrypt.hash(senha, SALT);
      const resposta_encriptada = await bcrypt.hash(resposta, SALT);
      const usuario = Usuario.create({
        cpf: cpf_encriptado,
        nome,
        perfil,
        email,
        senha: senha_encriptada,
        questao,
        resposta: resposta_encriptada,
        cor_tema,
      });
      const token = sign(
        { perfil: usuario.perfil, email: usuario.email },
        SENHA_JWT,
        { subject: usuario.nome, expiresIn: "1d" }
      );
      return { usuario, senha, token };
    } catch (error) {
      throw new Error("Erro BD: cadastrarUsuario");
    }
  }
}
