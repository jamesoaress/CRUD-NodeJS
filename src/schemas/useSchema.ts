import { z } from "zod";

export const userSchema = z.object({
    nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
    email: z.string().email("Formato de e-mail inválido."),
    senha: z.string(). min(6, "A senha deve ter no mínimo 6 caracteres"),
    idade: z.number().int("A idade deve ser um número inteiro").positive("A idade deve ser um número positivo.")
})