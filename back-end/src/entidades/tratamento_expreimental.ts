import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Medico from "./medico";
import Disponibilidade from "./disponibilidade";

export enum TipoTratamento { QUIMIOTERAPIA = "Quimioterapia", RADIOTERAPIA = "Radioterapia", CIRURGIA = "Cirurgia" };

@Entity()
export default class TratamentoExperimental extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    nome: string;
    
    @Column({ type: "enum", enum: TipoTratamento })
    tipo: TipoTratamento;
    
    @Column()
    descricao: string;
    
    @Column({ type: "date" })
    data_inicio: Date;
    
    @ManyToOne(() => Medico, (medico) => medico.tratamentos, { onDelete: "CASCADE" })
    medico: Medico;
    
    @OneToMany(() => Disponibilidade, (disponibilidade) => disponibilidade.tratamento)
    disponibilidades: Disponibilidade[];
}
