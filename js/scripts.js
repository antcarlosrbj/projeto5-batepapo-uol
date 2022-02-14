function downloadMessages () {
    let promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promessa.then(processarResposta);
    promessa.catch(processarErro);
}

function processarErro (resposta) {
    console.log(resposta);
}

function processarResposta(resposta) {
	mensagens = resposta.data;
    console.log(mensagens);
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

// setInterval(downloadMessages, 3000);
downloadMessages();
let mensagens = [];