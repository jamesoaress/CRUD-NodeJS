import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/Users";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite", // O arquivo do banco será criado na raiz do projeto
    synchronize: false, // Cria e atualiza as tabelas automaticamente (ótimo para desenvolvimento)
    logging: false, // Mude para true se quiser ver os comandos SQL no terminal
    entities: [User], // Em breve colocaremos o caminho do nosso Model de Usuário aqui
    migrations: [__dirname + "/migrations/*.ts"],
    subscribers: [],
});