const socket = window.io();

let clientNick = '';

const dom = {
  formMessage: document.querySelector('#form-message'),
  formNickname: document.querySelector('#form-nickname'),
  inputMessage: document.querySelector('#input-message'),
  inputNickname: document.querySelector('#input-nickname'),
  messageContainer: document.querySelector('#message-container'),
  userBox: document.querySelector('#user-box'),
  spanUser: document.querySelector(`#user-${clientNick}`),
};

dom.formMessage.addEventListener('submit', (e) => {
  e.preventDefault();

  socket.emit('message', { chatMessage: dom.inputMessage.value, nickname: clientNick });
  dom.inputMessage.value = '';
});

dom.formNickname.addEventListener('submit', (e) => {
  e.preventDefault();

  socket.emit('update-nickname', { oldNickname: clientNick, newNickname: dom.inputNickname.value });
  
  clientNick = dom.inputNickname.value;

  dom.inputNickname.value = '';
});

socket.on('user-nickname', (nick) => { clientNick = nick; });

socket.on('message', (msg) => {
  const span = document.createElement('span');
  span.innerText = msg;
  span.setAttribute('data-testid', 'message');

  dom.messageContainer.appendChild(span);
});

socket.on('new-connection', (userList) => {
  dom.userBox.innerHTML = '';

  userList.splice(userList.indexOf(clientNick), 1);
  userList.unshift(clientNick);
  
  userList.forEach((user) => {
    const nick = {
      divContainer: document.createElement('div'),
      spanNickname: document.createElement('span'),
      spanLetter: document.createElement('span'),
      avatar: document.createElement('div'),
      classes: `flex bg-gray-300 font-semibold\n
        h-10 items-center justify-center mr-2 rounded-full text-base text-white w-10`,
    };

    nick.avatar.setAttribute('id', 'avatar');
    nick.avatar.className = nick.classes;
    nick.spanLetter.innerText = user.slice(0, 1).toUpperCase();
    nick.avatar.appendChild(nick.spanLetter);
    
    nick.spanNickname.innerText = user;
    nick.spanNickname.setAttribute('data-testid', 'online-user');
    nick.spanNickname.className = 'font-semibold text-base';
    
    nick.divContainer.className = 'flex my-4';
    nick.divContainer.appendChild(nick.avatar);
    nick.divContainer.appendChild(nick.spanNickname);
    dom.userBox.appendChild(nick.divContainer);
  });
});

window.onbeforeunload = () => {
  socket.emit('disconnect', clientNick);
};