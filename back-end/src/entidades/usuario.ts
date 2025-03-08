import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import Medico from "./medico";
import Paciente from "./paciente";

export enum Perfil {
  PACIENTE = "paciente",
  MEDICO = "medico",
}
export enum Status {
  PENDENTE = "pendente",
  ATIVO = "ativo",
}
export enum Cores {
  AMARELO = "yellow",
  ANIL = "indigo",
  AZUL = "blue",
  AZUL_PISCINA = "cyan",
  CINZA_ESCURO = "bluegray",
  LARANJA = "orange",
  ROSA = "pink",
  ROXO = "purple",
  VERDE = "green",
  VERDE_AZULADO = "teal",
}

@Entity()
export default class Usuario extends BaseEntity {
  @PrimaryColumn()
  cpf: string;

  @Column({ type: "enum", enum: Perfil })
  perfil: Perfil;

  @Column({ type: "enum", enum: Status, default: Status.PENDENTE })
  status: Status;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column({ type: "enum", enum: Cores })
  cor_tema: Cores;

  @Column()
  questao: string;

  @Column({ default: "nao informada ou ocorreu erro ao inserir" })
  resposta: string;

  @OneToOne(() => Medico, (medico) => medico.usuario)
  medico: Medico;

  @OneToOne(() => Paciente, (paciente) => paciente.usuario)
  paciente: Paciente;

  @CreateDateColumn()
  data_criacao: Date;
}
