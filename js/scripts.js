function downloadMessages () {
    let promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promessa.then(processarResposta);
    promessa.catch(processarErro);
}

function processarErro (erro) {
    console.log("Status code: " + erro.response.status);
	console.log("Mensagem de erro: " + erro.response.data);
}

function processarResposta(resposta) {
	mensagens = resposta.data;
    showMessages(mensagens);
}

function showMessages (mensagens) {
    let main = document.querySelector("main");
    main.innerHTML = "";

    
    for (let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type == "status") {
            main.innerHTML += `<p class="status"><em>(<span class="time">${mensagens[i].time}</span>) </em><span class="from">${mensagens[i].from}</span><span class="publicText"> para </span><span class="privateText"> reservadamente para </span><span class="statusText"></span><span class="to publicText privateText">${mensagens[i].to}</span><span class="statusText"></span><span class="publicText privateText">: </span><span class="statusText"> </span><span class="text">${mensagens[i].text}</span></p>`;
        } else {
            if (mensagens[i].to == "Todos") {
                main.innerHTML += `<p class="publicMessage"><em>(<span class="time">${mensagens[i].time}</span>) </em><span class="from">${mensagens[i].from}</span><span class="publicText"> para </span><span class="privateText"> reservadamente para </span><span class="statusText"></span><span class="to publicText privateText">${mensagens[i].to}</span><span class="statusText"></span><span class="publicText privateText">: </span><span class="statusText"> </span><span class="text">${mensagens[i].text}</span></p>`;
            } else {
                main.innerHTML += `<p class="privateMessage"><em>(<span class="time">${mensagens[i].time}</span>) </em><span class="from">${mensagens[i].from}</span><span class="publicText"> para </span><span class="privateText"> reservadamente para </span><span class="statusText"></span><span class="to publicText privateText">${mensagens[i].to}</span><span class="statusText"></span><span class="publicText privateText">: </span><span class="statusText"> </span><span class="text">${mensagens[i].text}</span></p>`;
            }
        }
    }

    let p = document.querySelectorAll("main p");
    p[p.length - 1].scrollIntoView();
}

setInterval(downloadMessages, 3000);
let mensagens = [];

// Entrando na sala

function sendNameSuccess(message) {
    downloadMessages();
}

function sendNameFail(erro) {
    enterRoom();
}

function enterRoom() {
    myName = prompt("Qual o seu nome?");
    myName = {name: myName};

    sendName = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', myName);
    setInterval(userStatus, 5000);

    sendName.then(sendNameSuccess);
    sendName.catch(sendNameFail);
}

function userStatus() {
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', myName);
}

let sendName = "";
let myName = "";
enterRoom();