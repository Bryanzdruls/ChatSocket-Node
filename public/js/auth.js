const myForm = document.querySelector('form');
const url = 'http://localhost:8080/api/auth/'
myForm.addEventListener('submit', e =>{
    e.preventDefault();
    const formData ={};
    for(let el of myForm.elements){
        if (el.name.length>0) {
            formData[el.name] =el.value;
        }
    }
    fetch(url +'login', {
        method: 'POST',
        body: JSON.stringify( formData),
        headers: {'Content-Type': 'application/json'}
    })
    .then(resp => resp.json())
    .then(({msg, token} )=> {
        if (!msg) {
            return console.log(msg);
        }
        localStorage.setItem('token',token);
        window.location = 'chat.html'
    })
    .catch(e => {
        console.log(e);
    })
})
function handleCredentialResponse(response) {
           // decodeJwtResponse() is a custom function defined by you
           // to decode the credential response.
           const body = {id_token: response.credential};
           fetch(url+'google',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
           })
            .then( resp => resp.json())
            .then((resp) =>{
                const {token} = resp;
                localStorage.setItem('email',resp.user.email)
                localStorage.setItem('token',token)
                window.location = 'chat.html'
            })
            .catch(console.warn);
        }
        const button =document.getElementById('google_signout');
        button.onclick = ()=> {
            //console.log(google.accounts.id);
            google.accounts.id.disableAutoSelect();

            google.accounts.id.revoke(localStorage.getItem('email'), done =>{
                localStorage.clear();
                location.reload();
            })
        }