import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import ContextoUsuário from "../contextos/contexto-usuário";
import formatarPerfil from "../utilitarios/formatar-perfil";
import {
    estilizarBotão, estilizarColuna, estilizarGridColunaSidebar, estilizarGridSidebar,
    estilizarMenu, estilizarMenuLateralDesktop, estilizarMenuLateralMobile, estilizarSidebar,
    estilizarSubtítulo, estilizarTítulo
} from "../utilitarios/estilos";
export default function MenuLateral({ children }) {
    const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [visible, setVisible] = useState(false);
    const tamanhoDesktop = windowWidth > 991;
    const navegar = useNavigate();
    const opçõesMedico = [
        { label: "Página Inicial", command: () => navegar("/pagina-inicial") },
        {
            label: "Menu", items: [
                {
                    label: "Cadastrar Usuário", command: () => navegar("/atualizar-usuario"),
                    disabled: usuárioLogado.status !== "ativo"
                },
                { label: "Cadastrar Medico", command: () => navegar("/cadastrar-medico") },
                { label: "Sair do Sistema", command: () => sairSistema() }
            ]
        },
    ];
    const opçõesPaciente = [];
    function sairSistema() {
        setUsuárioLogado({});
        navegar("/");
    };
    function opçõesMenu() {
        switch (usuárioLogado.perfil) {
            case "medico": return opçõesMedico;
            case "paciente": return opçõesPaciente;
            default: return;
        }
    };
    function redimensionarJanela() {
        setWindowWidth(window.innerWidth);
    };
    function MenuServiços() {
        if (tamanhoDesktop) {
            return (
                <div className={estilizarMenuLateralDesktop(usuárioLogado?.cor_tema)}>
                    <h1 className={estilizarTítulo(usuárioLogado?.cor_tema)}>{usuárioLogado?.nome}</h1>
                    <h2 className={estilizarSubtítulo(usuárioLogado?.cor_tema)}>
                        {formatarPerfil(usuárioLogado?.perfil)}</h2>
                    <Menu className={estilizarMenu()} model={opçõesMenu()} />
                </div>
            );
        } else return (
            <>
                <div className={estilizarMenuLateralMobile(usuárioLogado?.cor_tema)}>
                    <Button className={estilizarBotão(usuárioLogado?.cor_tema)} icon="pi pi-bars"
                        aria-label="Filter" onClick={() => setVisible(true)} />
                    <h1 className={estilizarTítulo(usuárioLogado?.cor_tema)}>{usuárioLogado?.nome}</h1>
                    <h2 className={estilizarSubtítulo(usuárioLogado?.cor_tema)}>
                        {formatarPerfil(usuárioLogado?.perfil)}</h2>
                </div>
                <Sidebar className={estilizarSidebar()} visible={visible}
                    onHide={() => setVisible(false)} showCloseIcon>
                    <Menu className={estilizarMenu()} model={opçõesMenu()} />
                </Sidebar>
            </>
        );
    };

    useEffect(() => {
        window.addEventListener('resize', redimensionarJanela);
        return () => window.removeEventListener('resize', redimensionarJanela);
    }, []);
    return (
        <div className={estilizarGridSidebar(usuárioLogado?.cor_tema)}>
            <div className={estilizarGridColunaSidebar()}><MenuServiços /></div>
            <div className={estilizarColuna()}>{children}</div>
        </div>
    );
}