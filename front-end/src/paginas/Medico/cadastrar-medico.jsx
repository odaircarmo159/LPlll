import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import {
  serviçoCadastrarMedico,
  serviçoBuscarMedico,
} from "../../servicos/serviços-medico";
import mostrarToast from "../../utilitarios/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitarios/validações";
import {
  estilizarBotão,
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarDivCampo,
  estilizarDivider,
  estilizarDropdown,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarLabel,
} from "../../utilitarios/estilos";

export default function CadastrarMedico() {
  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({
    universidade_formacao: "",
    especialidade: "",
  });
  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);
  const navegar = useNavigate();

  const opçõesEspecialidade = [
    { label: "Cardiologia", value: "cardiologia" },
    { label: "Neurologia", value: "neurologia" },
  ];

  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    const valor = event.target.value;
    setDados({ ...dados, [chave]: valor });
  }

  function validarCampos() {
    let errosCamposObrigatórios;
    errosCamposObrigatórios = validarCamposObrigatórios(dados);
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  }

  function títuloFormulário() {
    if (usuárioLogado?.cadastrado) return "Consultar Médico";
    else return "Cadastrar Médico";
  }

  async function cadastrarMedico() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarMedico({
          ...dados,
          usuario_info: usuárioLogado,
          universidade_formacao: dados.universidade_formacao,
          especialidade: dados.especialidade,
        });

        if (response.data)
          setUsuárioLogado((usuário) => ({
            ...usuário,
            status: response.data.status,
            token: response.data.token,
          }));

        mostrarToast(
          referênciaToast,
          "Médico cadastrado com sucesso!",
          "sucesso"
        );
      } catch (error) {
        setCpfExistente(true);
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  }

  function labelBotãoSalvar() {
    if (usuárioLogado?.cadastrado) return "Consultar";
    else return "Cadastrar";
  }

  function açãoBotãoSalvar() {
    if (!usuárioLogado?.cadastrado) cadastrarMedico();
  }

  function redirecionar() {
    if (cpfExistente) {
      setUsuárioLogado(null);
      navegar("/criar-usuario");
    } else {
      setUsuárioLogado((usuárioLogado) => ({
        ...usuárioLogado,
        cadastrado: true,
      }));
      navegar("/pagina-inicial");
    }
  }

  useEffect(() => {
    let desmontado = false;
    async function buscarDadosMedico() {
      try {
        const response = await serviçoBuscarMedico(usuárioLogado.cpf);
        if (!desmontado && response.data) {
          setDados((dados) => ({
            ...dados,
            universidade_formacao: response.data.universidade_formacao,
            especialidade: response.data.especialidade,
          }));
        }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }

    if (usuárioLogado?.cadastrado) buscarDadosMedico();
    return () => (desmontado = true);
  }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast
        ref={referênciaToast}
        onHide={redirecionar}
        position="bottom-center"
      />
      <Card
        title={títuloFormulário()}
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Universidade de Formação*:
          </label>
          <input
            type="text"
            name="universidade_formacao"
            value={dados.universidade_formacao}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.universidade_formacao} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Especialidade*:
          </label>
          <Dropdown
            name="especialidade"
            className={estilizarDropdown(
              erros.especialidade,
              usuárioLogado.cor_tema
            )}
            value={dados.especialidade}
            options={opçõesEspecialidade}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />
          <MostrarMensagemErro mensagem={erros.especialidade} />
        </div>
        <Divider className={estilizarDivider(dados.cor_tema)} />
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={redirecionar}
          />
          <Button
            className={estilizarBotão()}
            label={labelBotãoSalvar()}
            onClick={açãoBotãoSalvar}
          />
        </div>
      </Card>
    </div>
  );
}
