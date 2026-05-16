import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../models/Users";
import { userSchema } from "../schemas/useSchema";
import { AppError } from "../errors/AppError"; // Importação da nossa classe

export class UserController {
    
    // 1. CRIAR USUÁRIO (POST)
    async create(req: Request, res: Response): Promise<any> {
        // Se der erro aqui, o Express joga direto pro Middleware Global
        const dadosValidados = userSchema.parse(req.body);
        const userRepository = AppDataSource.getRepository(User);

        const emailJaExiste = await userRepository.findOneBy({ email: dadosValidados.email });
        if (emailJaExiste) {
            throw new AppError("Este e-mail já está cadastrado!", 400);
        }

        const novoUsuario = userRepository.create(dadosValidados);
        await userRepository.save(novoUsuario);

        const { senha, ...usuarioSemSenha } = novoUsuario;
        return res.status(201).json(usuarioSemSenha);
    }

    // 2. LISTAR TODOS OS USUÁRIOS (GET)
    async list(req: Request, res: Response): Promise<any> {
        const userRepository = AppDataSource.getRepository(User);
        const usuarios = await userRepository.find();

        const usuariosSemSenha = usuarios.map(({ senha, ...resto }) => resto);

        return res.status(200).json(usuariosSemSenha);
    }

    // 3. BUSCAR USUÁRIO POR ID (GET /:id)
// 3. BUSCAR USUÁRIO POR ID (GET /:id)
    async show(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const userRepository = AppDataSource.getRepository(User);

        // Mudamos para Number(id)
        const usuario = await userRepository.findOneBy({ id: Number(id) });
        if (!usuario) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        const { senha, ...usuarioSemSenha } = usuario;
        return res.status(200).json(usuarioSemSenha);
    }

    // 4. ATUALIZAR USUÁRIO (PUT /:id)
    async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const dadosValidados = userSchema.parse(req.body);
        const userRepository = AppDataSource.getRepository(User);

        // Mudamos para Number(id)
        const usuario = await userRepository.findOneBy({ id: Number(id) });
        if (!usuario) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        const emailJaExiste = await userRepository.findOneBy({ email: dadosValidados.email });
        // Comparamos usando Number(id) para bater as tipagens
        if (emailJaExiste && emailJaExiste.id !== Number(id)) {
            throw new AppError("Este e-mail já está sendo usado por outro usuário!", 400);
        }

        userRepository.merge(usuario, dadosValidados);
        await userRepository.save(usuario);

        const { senha, ...usuarioSemSenha } = usuario;
        return res.status(200).json(usuarioSemSenha);
    }

    // 5. EXCLUIR USUÁRIO (DELETE /:id)
    async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const userRepository = AppDataSource.getRepository(User);

        // Mudamos para Number(id)
        const usuario = await userRepository.findOneBy({ id: Number(id) });
        if (!usuario) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        await userRepository.remove(usuario);

        return res.status(204).send();
    }
}