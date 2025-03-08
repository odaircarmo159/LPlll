import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from
    "typeorm";
import Paciente from "./paciente";
import TratamentoExperimental from "./tratamento_expreimental";

@Entity()
export default class Disponibilidade extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    periodo: string;
    
    @Column()
    localizacao: string;
    
    @CreateDateColumn()
    data_registro: Date;
    
    @ManyToOne(() => TratamentoExperimental, (tratamento) => tratamento.disponibilidades, { onDelete: "CASCADE" })
    tratamento: TratamentoExperimental;
    
    @ManyToOne(() => Paciente, (paciente) => paciente.disponibilidades, { onDelete: "CASCADE" })
    paciente: Paciente;
}