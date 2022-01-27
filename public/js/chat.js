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
  avatarTop: document.querySelector('#avatar-top'),
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

  dom.inputNickname.value = clientNick;
  dom.avatarTop.innerHTML = clientNick.slice(0, 1).toUpperCase();
});

socket.on('user-nickname', (nick) => {
  clientNick = nick;

  dom.inputNickname.value = clientNick;
  dom.avatarTop.innerHTML = clientNick.slice(0, 1).toUpperCase();
});

socket.on('message', (msg, nick) => {
  const divContainer = document.createElement('div');

  const classAvatar = `avatar flex bg-gray-300 font-semibold
  h-8 items-center justify-center ml-2 rounded-full text-sm text-indigo-600 w-10 sm:h-10`;
  
  const classContent = `bg-indigo-600 mt-2 py-2.5 px-3.5\n
  rounded-bl-lg rounded-tl-lg rounded-br-lg shadow-md text-white w-96`;
  
  divContainer.className = 'conatiner-msg flex justify-end mr-3 mt-4';

  divContainer.innerHTML = `
  <div class="${classContent}">
    <span data-testid="message">${msg}</span>
  </div>
  <div class="${classAvatar}">
    <span class="font-semibold text-base">${nick.slice(0, 1).toUpperCase()}</span>
  </div>
  `;

  dom.messageContainer.appendChild(divContainer).scrollIntoView(true);
});

socket.on('new-connection', (userList) => {
  dom.userBox.innerHTML = '';
  
  userList.splice(userList.indexOf(clientNick), 1);
  userList.unshift(clientNick);
  
  userList.forEach((user) => {
    const divContainer = document.createElement('div');

    const classes = `flex bg-gray-300 font-semibold\n
      h-10 items-center justify-center mr-2 rounded-full text-base text-indigo-600 w-10`;
    
    divContainer.className = 'flex my-4';
    divContainer.innerHTML = `
    <div class="avatar ${classes}">\n
      <span>${user.slice(0, 1).toUpperCase()}</span>
    </div>\n
    <span data-testid="online-user" class="font-semibold text-base">
      ${user}
    </span>
      `;

    dom.userBox.appendChild(divContainer);
  });
});

window.onbeforeunload = () => {
  socket.emit('disconnect', clientNick);
};