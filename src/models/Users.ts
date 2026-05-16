import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity("users")
export class User{

    @PrimaryGeneratedColumn ("increment")
    id!: number;
    @Column({type: "varchar"})
    nome!: string;

    @Column({type: "varchar", unique: true})
    email!: string;

    @Column({ type: "varchar"})
    senha!: string;

    @Column("int")
    idade!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}