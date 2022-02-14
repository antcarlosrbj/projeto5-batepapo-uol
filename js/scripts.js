// Mostrar mensagens

function downloadMessages () {
    let promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promessa.then(downloadMessagesSuccess);
    promessa.catch(downloadMessagesFail);
}

function downloadMessagesFail (erro) {
    console.log("Status code: " + erro.response.status);
	console.log("Mensagem de erro: " + erro.response.data);
}

function downloadMessagesSuccess(answer) {
	mensagens = answer.data;
    showMessages(mensagens);
}

function showMessages (mensagens) {
    let main = document.querySelector("main");
    main.innerHTML = "";

    
    for (let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type == "status") {
            main.innerHTML += `<p class="status" data-identifier="message"><em>(<span class="time">${mensagens[i].time}</span>) </em><span class="from">${mensagens[i].from}</span><span class="publicText"> para </span><span class="privateText"> reservadamente para </span><span class="statusText"></span><span class="to publicText privateText">${mensagens[i].to}</span><span class="statusText"></span><span class="publicText privateText">: </span><span class="statusText"> </span><span class="text">${mensagens[i].text}</span></p>`;
        } else {
            if (mensagens[i].type == "message") {
                main.innerHTML += `<p class="publicMessage" data-identifier="message"><em>(<span class="time">${mensagens[i].time}</span>) </em><span class="from">${mensagens[i].from}</span><span class="publicText"> para </span><span class="privateText"> reservadamente para </span><span class="statusText"></span><span class="to publicText privateText">${mensagens[i].to}</span><span class="statusText"></span><span class="publicText privateText">: </span><span class="statusText"> </span><span class="text">${mensagens[i].text}</span></p>`;
            } else if (mensagens[i].type == "private_message" && (mensagens[i].to == myName || mensagens[i].from == myName)) {
                main.innerHTML += `<p class="privateMessage" data-identifier="message"><em>(<span class="time">${mensagens[i].time}</span>) </em><span class="from">${mensagens[i].from}</span><span class="publicText"> para </span><span class="privateText"> reservadamente para </span><span class="statusText"></span><span class="to publicText privateText">${mensagens[i].to}</span><span class="statusText"></span><span class="publicText privateText">: </span><span class="statusText"> </span><span class="text">${mensagens[i].text}</span></p>`;
            }
        }
    }

    let p = document.querySelectorAll("main p");
    p[p.length - 1].scrollIntoView();
}

setInterval(downloadMessages, 3000);
let mensagens = [];

// Entrando na sala

function sendNameSuccess(answer) {
    downloadMessages();
}

function sendNameFail(erro) {
    enterRoom();
}

function enterRoom() {
    myName = prompt("Qual o seu nome?");
    myNameObject = {name: myName};

    sendName = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', myNameObject);
    setInterval(userStatus, 5000);

    sendName.then(sendNameSuccess);
    sendName.catch(sendNameFail);
}

function userStatus() {
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', myNameObject);
}

let sendName = "";
let myName = "";
let myNameObject = "";
enterRoom();

// Enviar mensagem

function sendMessage() {
    let text = document.querySelector(".message");
    
    let message = {
        from: myName,
        to: contact,
        text: text.value,
        type: visibility
    }

    if (text.value != ""){
        text.value = "";

        let requestSendMessage = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', message);
        requestSendMessage.then(sendMessageSuccess);
        requestSendMessage.catch(sendMessageFail);
    }
}

function sendMessageSuccess(answer) {
    downloadMessages();
}

function sendMessageFail(erro) {
    window.location.reload();
}

// Mostrar opções

function showOptions() {
    let options = document.querySelectorAll(".options");
    options[0].classList.add("showBackground");
    options[1].classList.add("show");
    listParticipants();
}

function hiddenOptions() {
    let options = document.querySelectorAll(".options");
    options[0].classList.remove("showBackground");
    options[1].classList.remove("show");
}

function listParticipants() {
    let requestListParticipants = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    requestListParticipants.then(listParticipantsSuccess);
}

function listParticipantsSuccess(list) {
    let participants = document.querySelector(".contact");
    participants.innerHTML = `
        <li class="selected" onclick="selectContact(this)">
            <img src="img/people.png" alt="Logo Todos">
            <p>Todos</p>
            <img class="check" src="img/check.png" alt="Selecionado">
        </li>
    `;
    for (let i = 0; i < list.data.length; i++) {
        participants.innerHTML += `
            <li class="" onclick="selectContact(this)" data-identifier="participant">
                <img src="img/person-circle.png" alt="Pessoa com circulo">
                <p>${list.data[i].name}</p>
                <img class="check" src="img/check.png" alt="Selecionado">
            </li>
        `;
    }
}


// Selecionar contato e visibilidade

let contact = "Todos";
let visibility = "message";

function selectContact(liSelected) {
    let contactHTML = document.querySelector(".contact .selected");
    contactHTML.classList.remove("selected");

    liSelected.classList.add("selected");
    
    contact = liSelected.querySelector("p");
    contact = contact.innerText;

    recipient()
}

function selectVisibility(selectedVisibility) {
    let visibilityHTML = document.querySelector(".visibility .selected");
    visibilityHTML.classList.remove("selected");

    selectedVisibility.classList.add("selected");
    
    visibility = selectedVisibility.querySelector("p");
    visibility = visibility.innerText;
    if (visibility == "Público") {
        visibility = "message";
    } else {
        visibility = "private_message";
    }

    recipient();
}

function recipient() {
    let footer = document.querySelector("footer p");

    if (contact != "Todos"){
        if (visibility == "message") {
            footer.innerHTML = `Enviando para ${contact}`;
        } else {
            footer.innerHTML = `Enviando para ${contact} (reservadamente)`;
        }
    } else {
        footer.innerHTML = "";
    }
}

// Envio com Enter

document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        sendMessage();
    }
});