import "dotenv/config";
import pg from "pg";
const { Pool } = pg;
function variavelObrigatoria(nome) {
    const valor = process.env[nome];
    if (!valor) {
        throw new Error(`Variável de ambiente não definida: ${nome}`);
    }
    return valor;
}
export const pool = new Pool({
    host: process.env.PGHOST ?? "127.0.0.1",
    port: Number(process.env.PGPORT ?? 5432),
    user: variavelObrigatoria("PGUSER"),
    password: variavelObrigatoria("PGPASSWORD"),
    database: variavelObrigatoria("PGDATABASE")
});
