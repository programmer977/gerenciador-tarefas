import './style.css'

interface Tarefa {
  id : number,
  titulo : string,
  concluida : boolean,
  criada_em : string
}

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
    throw new Error("Elemento #app não encontrado.");
}

app.innerHTML = 
    `<main>
        <h1>Gerenciador de Tarefas</h1>
        <form id="form-tarefa">
            <label for="titulo">Nova tarefa</label>
            <input id="titulo" name="titulo" type="text" maxlength="120" placeholder="Digite sua tarefa" required>
            <button type="submit">Cadastrar</button>
        </form>
        <p id="mensagem" role="status"></p>
        <h2>Minhas tarefas</h2>
        <ul id="lista"></ul>
    </main>`;

const formulario = document.querySelector<HTMLFormElement>("#form-tarefa");
const campoTitulo = document.querySelector<HTMLFormElement>("#titulo");
const lista = document.querySelector<HTMLDivElement>("#lista");
const mensagem = document.querySelector<HTMLDivElement>("#mensagem");

if (!formulario || !campoTitulo || !lista || !mensagem) {
    throw new Error("Elementos da interface não encontrados.");
}

function mostrarErro(erro: unknown): void {
    if (erro instanceof Error) { mensagem!.textContent = erro.message;
        return;
    }
    mensagem!.textContent = "Erro desconhecido.";
}
async function verificarResposta(resposta:Response):Promise<void>{
    if (resposta.ok) {
        return;
    }
    const dados: unknown = await resposta.json().catch(() => null);
    if ( typeof dados === "object" && dados !== null && "erro" in dados && typeof dados.erro === "string") 
      {
        throw new Error(dados.erro);
    }
    throw new Error(`Erro HTTP ${resposta.status}`);
}

async function carregarTarefas():Promise<void> {
    const resposta = await fetch("/api/tarefas");
    await verificarResposta(resposta);
    const tarefas = await resposta.json() as Tarefa[];
    renderizarTarefas(tarefas);
}

async function cadastrarTarefa(titulo:string):Promise<void>{
  const resposta = await fetch("/api/tarefas", {method:"POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({titulo: titulo})});
  await verificarResposta(resposta);
  await carregarTarefas();

}

async function alternarConclusao(tarefa:Tarefa):Promise<void>{
  const resposta = await fetch(`/api/tarefas/${tarefa.id}`, { method : "PATCH", headers: {"Content-Type": "application/json"},body: JSON.stringify({concluida: !tarefa.concluida})})
  await verificarResposta(resposta);
  await carregarTarefas();
}

async function excluirTarefa(id: number): Promise<void> {
    const resposta = await fetch(`/api/tarefas/${id}`,{method: "DELETE"});
    await verificarResposta(resposta);
    await carregarTarefas();
}

function renderizarTarefas(
    tarefas: Tarefa[]
): void {
    lista!.replaceChildren();
    if (tarefas.length === 0) {
        const item = document.createElement("li");
        item.textContent = "Nenhuma tarefa cadastrada.";
        lista!.appendChild(item);
        return;
    }
    for (const tarefa of tarefas) {
        const item = document.createElement("li");
        const texto = document.createElement("span");
        texto.textContent = tarefa.titulo;
        if (tarefa.concluida) {
            texto.style.textDecoration = "line-through";
        }
        const botaoConclusao = document.createElement("button");
        botaoConclusao.type = "button";
        botaoConclusao.textContent = tarefa.concluida ? "Reabrir" : "Concluir";
        botaoConclusao.addEventListener(
            "click",
            async () => {
                try {
                    await alternarConclusao(tarefa);
                } catch (erro) {
                    mostrarErro(erro);
                }
            }
        );
        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.addEventListener( "click", async () => {
                try { await excluirTarefa(tarefa.id);
              } catch (erro) {
                    mostrarErro(erro);
                }
            }
        );
        item.append( texto, botaoConclusao,botaoExcluir);
        lista!.appendChild(item);
    }
}
formulario.addEventListener( "submit", async (evento) => { evento.preventDefault();
        const titulo = campoTitulo.value.trim();
        if (titulo.length === 0) {
            mensagem.textContent = "Digite uma tarefa.";
            return;
        }
        try { await cadastrarTarefa(titulo);
            formulario.reset();
            mensagem.textContent ="Tarefa cadastrada com sucesso.";
        } catch (erro) {mostrarErro(erro);
        }
    }
);
carregarTarefas().catch(mostrarErro);
