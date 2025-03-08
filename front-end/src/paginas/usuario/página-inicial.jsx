import { useContext } from "react";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import ContextoUsuário from "../../contextos/contexto-usuário";
import tratamento from "../../imagens/imagem-tratamento.jpg";
import {
  estilizarCard,
  estilizarCardHeaderCentralizado,
  estilizarPáginaÚnica,
} from "../../utilitarios/estilos";

export default function PáginaInicial() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  function HeaderCentralizado() {
    return (
      <div className={estilizarCardHeaderCentralizado()}>
        Propostas de Tratamentos Expreimentais
      </div>
    );
  }
  return (
    <div className={estilizarPáginaÚnica()}>
      <Card
        header={HeaderCentralizado}
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <Image src={tratamento} alt="Inovação é esperaça!" width={1100} />
      </Card>
    </div>
  );
}
