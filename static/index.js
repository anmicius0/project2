
document.addEventListener('DOMContentLoaded', () => {
    // user_profile: a object that contain ('displayname', 'channels')
    // app: a vue object to 'index.html' ('haveProfile', 'user_profile')
    // socket: a socket connction
    
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    // different type of url
    var current_url = document.location.href;
    var current_url_array = current_url.split('/');
    var current_room = null;

    // if user is under /chat
    // send room to server (/chat/< room >)
    if (current_url_array[ current_url_array.length - 2] == 'chat') {
        current_room = current_url_array[ current_url_array.length - 1]
        socket.emit('join', current_room);
    }

    // Vue app (under body tag)
    var app = new Vue({
        el: '#app',
        data: {
            haveProfile: false,
            user_profile: { displayname: '', channels: []},
        },
        methods: {
            set_profile: function () {
                var displayname = document.querySelector('#form-displayname').value;
                this.user_profile.displayname = displayname;
                this.haveProfile = true;
                localStorage.setItem('user_profile', JSON.stringify(this.user_profile) );
                window.location.href = document.location.href + 'chat/hall';
            },
            resotre_profile: function () {
                this.user_profile = user_profile;
                window.location.href = document.location.href + 'chat/hall';
            },
            submit_chat: function () {
                // msg (JSON) :
                //     user: displayname
                //     text: the text
                //     namespace: current url
                const msg = JSON.stringify({
                    'user': JSON.parse(app.user_profile).displayname, 
                    'text': document.querySelector('#chat_text').value, 
                    'room': current_room});
                
                socket.emit('submit_chat', msg);
            }
        }
    });

    // try to get user_profile
    check_userprofile();

    // When a new vote is announced, add to the unordered list
    socket.on('receive_message', msg => {
        msg = JSON.parse(msg)
        const li = document.createElement('li');
        li.innerHTML = `${msg.user}: ${msg.text}`;
        document.querySelector('#chat_list').append(li);
    });
    
    function check_userprofile() {
    
        var user_profile = localStorage.getItem('user_profile');
        
        // If there is a profile on localStorage
        if(user_profile){
            app.user_profile = user_profile;
            app.haveProfile = true;
        } else {
            app.haveProfile = false
        }
    }
    
})
