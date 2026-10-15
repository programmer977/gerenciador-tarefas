import express, { type Request, type Response, type NextFunction } from "express";
import { pool } from "./db.js";

const app = express();
const PORT = 3000;
app.use(express.json());

interface Tarefa {
    id : number,
    titulo : string,
    concluida : boolean,
    criada_em : Date
}

app.get("/api/tarefas", async (_req,res)=>{
    const resultado = await pool.query(
    `SELECT id , titulo , concluida , criada_em FROM tarefas ORDER BY id DESC`
    )
    res.json(resultado.rows);
});

app.post("/api/tarefas", async (req,res)=>{
    const titulo = req.body?.titulo;

    if(typeof titulo!=="string"||titulo.trim().length===0||titulo.trim().length>120){
        return res.status(400).json({erro :"o título deve ter entre 0 e 120 caracteres"});
    }

    const resultado = await pool.query<Tarefa>(
        `INSERT INTO tarefas (titulo) values ($1) returning id,titulo,concluida,criada_em`,[titulo.trim()]   
    );
    res.status(201).json(resultado.rows[0]);
})

app.patch("/api/tarefas/:id" , async (req,res)=>{
    const id = Number(req.params.id);
    const concluida = req.body.concluida;

    if(!Number.isSafeInteger(id)||id===0){
        return res.status(400).json({erro:"id inválido"});
    }
    if(typeof concluida!=="boolean"){
        return res.status(400).json({erro:"o campo concluída deve booleano"});
    }

    const resultado = await pool.query<Tarefa>(
        `UPDATE tarefas SET concluida = ($1) WHERE id = ($2) 
        RETURNING id,titulo,concluida,criada_em`
        ,[concluida,id]
    )
    if(resultado.rows.length===0){
        return res.status(404).json({erro:"tarefa não encontrada"});
    }
    res.json(resultado.rows[0]);
})

app.delete("/api/tarefas/:id",async(req,res)=>{
    const id = Number(req.params.id);

    if(!Number.isSafeInteger(id)){
        return res.status(404).json({erro:"id inválido"});
    }
    const resultado = await pool.query<Tarefa>(
        `DELETE FROM tarefas WHERE id = ($1)`,[id]
    );
    if(resultado.rowCount===0){
        res.status(404).json({erro:"tarefa não encontrada"});
    }
    return res.status(204).send();
})

app.use(( erro: Error, _req: Request, res: Response, _next: NextFunction ) => {
    if (erro instanceof SyntaxError && "body" in erro) {
        res.status(400).json({ erro: "JSON inválido."});
        return;
    }
    console.error("Erro interno:", erro);
    res.status(500).json({ erro: "Erro interno no servidor."});
});

async function inicializarServidor(): Promise<void> {
    await pool.query('SELECT 1');
    app.listen(PORT, "127.0.0.1" , ()=>{
        console.log(`API disponível na porta ${PORT}`);
    })
}
inicializarServidor().catch((erro:unknown)=>{
    console.log("falha ao iniciar servidor",erro);
    process.exit(1);
})
