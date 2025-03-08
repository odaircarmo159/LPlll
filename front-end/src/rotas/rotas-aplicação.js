import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../paginas/usuario/logar-usuário";
import CadastrarUsuário from "../paginas/usuario/cadastrar-usuário";
import PáginaInicial from "../paginas/usuario/página-inicial";
import CadastrarMedico from "../paginas/Medico/cadastrar-medico";

export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LogarUsuário />} path="/" />
                <Route element={<CadastrarUsuário />} path="criar-usuario" />
                <Route element={<RotasUsuárioLogado />}>
                    <Route element={<PáginaInicial />} path="pagina-inicial" />
                    <Route element={<CadastrarUsuário />} path="atualizar-usuario" />
                    <Route element={<CadastrarMedico />} path="cadastrar-medico" />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}