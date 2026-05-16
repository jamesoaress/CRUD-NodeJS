import { AppDataSource } from "./data-source";
import { User } from "../models/Users";

async function runSeed() {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);

    const users = [
        { nome: "Usuário Um", email: "um@teste.com", senha: "password123", idade: 20 },
        { nome: "Usuário Dois", email: "dois@teste.com", senha: "password123", idade: 25 },
        { nome: "Usuário Três", email: "tres@teste.com", senha: "password123", idade: 30 },
    ];

    for (const userData of users) {
        const userExists = await userRepository.findOneBy({ email: userData.email });
        if (!userExists) {
            const newUser = userRepository.create(userData);
            await userRepository.save(newUser);
        }
    }

    console.log("Inserção automática de usuários realizada com sucesso!");
    process.exit();
}

runSeed();