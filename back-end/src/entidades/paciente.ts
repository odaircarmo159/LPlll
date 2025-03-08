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
import Disponibilidade from "./disponibilidade";

@Entity()
export default class Paciente extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  altura: number;

  @Column()
  peso: number;

  @Column()
  sintoma: string;

  @OneToMany(
    () => Disponibilidade,
    (disponibilidade) => disponibilidade.paciente
  )
  disponibilidades: Disponibilidade[];

  @OneToOne(() => Usuário, (usuario) => usuario.paciente, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  usuario: Usuário;
}
