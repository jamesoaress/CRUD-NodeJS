import "reflect-metadata"
import "dotenv/config"
import cors from "cors"
import express from "express"
import { AppDataSource } from "./database/data-source";
import userRoutes from "./routes/userRoutes"
import { ZodError } from "zod";
import  { Request, Response, NextFunction} from "express";
import { AppError } from "./errors/AppError";

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError) {
        return res.status(400).json({ erro: "O formato dos dados enviados está incorreto (JSON inválido)." });
    }
    next();
});

app.use("/users", userRoutes);
app.use((err: Error, req: Request, res: Response, next: NextFunction): any => {
    
    // 1. Se for um erro que nós mesmos disparamos (AppError)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ erro: err.message });
    }

    // 2. Se for um erro de validação do Zod (Regra do PDF!)
    if (err instanceof ZodError) {
        const mensagensDeErro = err.issues.map((issue) => issue.message);
        return res.status(400).json({ erros: mensagensDeErro });
    }

    // 3. Se for um erro não esperado (Erro 500)
    console.error("Erro interno:", err); // Mostra no terminal para o desenvolvedor
    return res.status(500).json({ erro: "Internal server error" });
});
AppDataSource.initialize()
    .then(() => {
        console.log("📦 Conexão com o SQLite estabelecida com sucesso!");
        
        // Só começa a escutar a porta se o banco conectou
        app.listen(Number(PORT), () => {
            console.log('🚀 Iniciou o servidor na porta: ' + PORT);
        });
    })
    .catch((error) => {
        console.error("❌ Erro ao conectar no banco de dados:", error);
    });

