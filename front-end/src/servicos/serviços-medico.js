import servidor from "./servidor";

export function serviçoCadastrarMedico(medico) {
  console.log("Enviando dados para cadastrar médico:", medico); // Adicione este log
  return servidor.post("/medicos", medico);
}

export function serviçoBuscarMedico(cpf) {
  console.log("Buscando médico com CPF:", cpf); // Adicione este log
  return servidor.get(`/medicos/${cpf}`);
}
