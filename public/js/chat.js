

const url = 'http://localhost:8080/api/auth/';
let user = null;
let socket = null;


const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUsers = document.querySelector('#ulUsers');
const ulMsg = document.querySelector('#ulMsg');
const btnExit = document.querySelector('#btnExit');
//validar token de local storage
const validateJWT = async() =>{
    const token = localStorage.getItem('token') || '';
    if (token.length <=10) {
        window.location= 'index.html';
        throw new Error('There is no token')
    }
    const resp = await fetch(url,{
        headers:{'x-token':token}
    });

    const { user: userDB, token: tokenDB} = await resp.json();
    localStorage.setItem('token',tokenDB);
    user = userDB;
    document.title = user.name
    await connectSocket();
}

const connectSocket = async() =>{
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token'),
        }
    });
    socket.on('connect', ()=>{
        console.log('sockets online');
    })
    socket.on('disconnect', ()=>{
        console.log('sockets offline');
    })
    socket.on('active-users', drawUser)
    socket.on('get-messages', drawMessages)
    socket.on('private-msg',(payload)=>{
        console.log(payload);
    })
}
const drawUser = ( users = [])=>{
    let usersHtml = '';
    users.forEach(({uid,name})=> {
        usersHtml += `
            <li>
                <p>
                    <span class="text-success">${name}</span>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    });
    ulUsers.innerHTML = usersHtml;
}
const drawMessages = ( messages = [])=>{
    let messagesHtml = '';
    messages.forEach(({msg, name})=> {
        messagesHtml += `
            <li>
                <p>
                    <h5 class="text-primary">${name}</h5>
                    <span class="fs-6 text-muted">${msg}</span>
                </p>
            </li>
        `
    });
    ulMsg.innerHTML = messagesHtml;
}
txtMsg.addEventListener('keyup', ({keyCode}) =>{
    const msg = txtMsg.value;
    const uid = txtUid.value;
    
    if (keyCode !== 13) {
        return;
    }
    if (msg.length===0) {
        return;
    }
    socket.emit('send-msg', {msg,uid});
    txtMsg.value ='';
})

const main =async() =>{
    await validateJWT();
}


main();