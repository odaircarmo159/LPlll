import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Usuário from "./usuario";
import TratamentoExperimental from "./tratamento_expreimental";

@Entity()
export default class Medico extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  universidade_formacao: string;

  @Column()
  especialidade: string;

  @OneToMany(() => TratamentoExperimental, (tratamento) => tratamento.medico)
  tratamentos: TratamentoExperimental[];

  @OneToOne(() => Usuário, (usuario) => usuario.medico, { onDelete: "CASCADE" })
  @JoinColumn()
  usuario: Usuário;
}
