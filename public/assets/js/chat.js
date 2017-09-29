/**
 * Chat.js
 * @author wawbz
 * @namespace BZCHAT
 */

if (typeof jQuery === "undefined") {
    throw new Error("BZCHAT requires jQuery");
}

if (typeof io === "undefined") {
    throw new Error("BZCHAT requires socket.io");
}

if (typeof moment === "undefined") {
    throw new Error("BZCHAT requires moment.js");
}

var BZCHAT = {
    varsion: "1.0.0"
};

(function () {

    $.fn.scrollDown = function () { // jQuery function
        var el = $(this);
        el.scrollTop(el[0].scrollHeight);
    };

    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    BZCHAT.config = {};

    BZCHAT.element = {
        chatMessage: ".direct-chat-messages",
        chatContact: ".direct-chat-contacts",
        sendMessage: '#send-message',
        messageToSend: '#message-to-send'

    };

    BZCHAT.config.Router = {
        SocketServer: 'http://192.168.5.60:8888',
        SessionUser: '/users/login/session',
        OnlineUser: '/users/online',
        Notification: '/chat/notify'
    };

    BZCHAT.config.Avatar = {
        have: function (avatar) {
            return 'https://main.baezeni.com/people-manager/pic/' + avatar;
        },
        no: function (avatar) {
            return 'https://dummyimage.com/50x50/496173/ffffff&text=' + avatar;
        }
    };

})();



(function () {


    BZCHAT.fn = {};

    BZCHAT.fn.findObjectByKey = function (array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }



})();



(function () {

    BZCHAT.templateUser = function (user) {
        var name = user.email.split("@")[0].capitalize();
        var avatar = user.avatar ? BZCHAT.config.Avatar.have(user.avatar) : BZCHAT.config.Avatar.no(name.substr(0, 1))

        var html = '<li>' +
            '   <a href="javascript:void(0);" data-userid="' + user.id + '">' +
            '       <img class="contacts-list-img" src="' + avatar + '">' +
            '       <div class="contacts-list-info">' +
            '           <span class="contacts-list-name">' +
            '               ' + name +
            '               <i id="online-status-' + user.id + '" class="fa ' + (user.status === 'Y' ? 'fa-circle user-online' : 'fa-circle-o user-offline') + '"></i> ' +
            '               <span id="unread-number-' + user.id + '" data-toggle="tooltip" title="3 New Messages" class="badge notify-number"></span>' +
            '               <small class="contacts-list-date pull-right">' + moment(user.datetime).calendar() + '</small>' +
            '           </span>' +
            '       <span class="contacts-list-msg"></span>' +
            '       </div>' +
            '   </a>' +
            '</li>';
        return html;

    };

    BZCHAT.templateMessage = {

        left: function (msg, action) {

            var user = BZCHAT.fn.findObjectByKey(BZCHAT.User.Online, "id", msg.user_from_id);

            var name = user.email.split("@")[0].capitalize();
            var avatar = user.avatar ? BZCHAT.config.Avatar.have(user.avatar) : BZCHAT.config.Avatar.no(name.substr(0, 1))

            var html = '<div class="direct-chat-msg">' +
                '    <div class="direct-chat-info clearfix">' +
                '        <span class="direct-chat-name pull-left">' + name + '</span>' +
                '        <span class="direct-chat-timestamp pull-right">' + moment(msg.datetime).calendar() + '</span>' +
                '    </div>' +

                '    <img class="direct-chat-img" src="' + avatar + '" alt="' + name + '">' +
                '    <div class="direct-chat-text">' +
                '        ' + msg.message.toString() +
                '    </div>' +
                '</div>';
            $(BZCHAT.element.chatMessage).append(html);
            this.buttom(action);
            this.readMessage(msg);
        },

        right: function (msg, action) {

            var user = BZCHAT.fn.findObjectByKey(BZCHAT.User.Online, "id", msg.user_from_id);

            var name = user.email.split("@")[0].capitalize();
            var avatar = user.avatar ? BZCHAT.config.Avatar.have(user.avatar) : BZCHAT.config.Avatar.no(name.substr(0, 1))


            var html = '<div class="direct-chat-msg right">' +
                '     <div class="direct-chat-info clearfix">' +
                '         <span class="direct-chat-name pull-right">' + name + '</span>' +
                '         <span class="direct-chat-timestamp pull-left">' + moment(msg.datetime).calendar() + '</span>' +
                '     </div>' +
                '     <img class="direct-chat-img" src="' + avatar + '" alt="' + name + '">' +
                '     <div class="direct-chat-text">' +
                '         ' + msg.message.toString() +
                '     </div>' +
                ' </div>';
            $(BZCHAT.element.chatMessage).append(html);
            this.buttom(action);


        },

        buttom: function (action) {

            if (action) {
                $(BZCHAT.element.chatMessage).animate({
                    scrollTop: $(BZCHAT.element.chatMessage).prop("scrollHeight")
                }, 500);
            } else {
                $(BZCHAT.element.chatMessage).scrollDown();
            }

        },

        readMessage: function (data) {
            if (data.status && data.status === "UR") {
                BZCHAT.socket.emit("chat.update", data);
            }
        }


    }


})();



(function () {

    BZCHAT.GET = function (URL, type, dataType) {
        var dataAPI = "";
        var isSuccess = false;
        var response = $.ajax({
            type: type,
            url: URL,
            data: dataType,
            async: false,
            cache: false,
            success: function () {
                isSuccess = true;
            }
        }).responseText;
        if (!isSuccess) {
            dataAPI = "";
        }

        dataAPI = JSON.parse(response);

        return dataAPI;
    };

    BZCHAT.SessionUser = BZCHAT.GET(BZCHAT.config.Router.SessionUser, 'GET', 'JSON');

    BZCHAT.GetUnreadMessage = function () {
        return BZCHAT.GET(BZCHAT.config.Router.Notification, 'GET', 'JSON');
    };


})();


/**
 * @function is connect socket server
 */

(function (io) {

    BZCHAT.socket = io(BZCHAT.config.Router.SocketServer, {
        transports: ['websocket'],
        upgrade: false
    });

    BZCHAT.socket.emit("join", BZCHAT.SessionUser);

})(io);





/**
 * @User is manager user online
 */

(function () {

    BZCHAT.User = {};

    BZCHAT.User.Active = '';

    BZCHAT.User.UserList = function () {
        var user = BZCHAT.GET(BZCHAT.config.Router.OnlineUser, 'GET', 'JSON');

        var template = '';
        for (var i in user) {

            if (user[i].id !== BZCHAT.SessionUser.id) {

                template += BZCHAT.templateUser(user[i]);
            }
        }

        $(BZCHAT.element.chatContact).find('ul').html(template);


        return user;
    };

    BZCHAT.socket.on('user joined', function (user) {
        $('#online-status-' + user.id).removeClass('fa-circle-o user-offline').addClass('fa-circle user-online');

    });


    BZCHAT.socket.on('leavechat', function (user) {
        $('#online-status-' + user.id).removeClass('fa-circle user-online').addClass('fa-circle-o user-offline');
    });

    BZCHAT.User.Online = BZCHAT.User.UserList();


})();




/**
 * @Message is manager chat message
 */

(function () {

    BZCHAT.Message = {};

    BZCHAT.socket.on("history.message", function (messages) {
        BZCHAT.Message.History(messages);
    });

    BZCHAT.Message.History = function (messages) {


        for (var i in messages) {
            var msg = messages[i];

            if (msg.user_from_id === BZCHAT.SessionUser.id) {
                BZCHAT.templateMessage.right(msg, false);
            } else {
                BZCHAT.templateMessage.left(msg, false);
            }

        }

    };

    BZCHAT.Message.GET = function (message) {

        BZCHAT.templateMessage.left(message, true);

    };

    BZCHAT.Message.SEND = function () {

        var message = $(BZCHAT.element.messageToSend).val();

        if (!BZCHAT.User.Active) {
            alert("No user to send");
            return false;
        }

        if (!message) return false;

        var data = {
            user_from_id: BZCHAT.SessionUser.id,
            user_to_id: BZCHAT.User.Active,
            message: message,
            datetime: new Date()
        };

        BZCHAT.socket.emit('chat.message', data);
        BZCHAT.templateMessage.right(data, true);
        $(BZCHAT.element.messageToSend).val('');
        $(BZCHAT.element.messageToSend).focus()



    };


    BZCHAT.Message.Room = function (user_from_id, user_to_id) {

        if (user_from_id === user_to_id) {
            return false;
        }

        var room = [user_from_id, user_to_id].sort().join(''); //Array sort and join need to do both server and client

        BZCHAT.socket.emit('chat.room', {
            room: room,
            user: BZCHAT.SessionUser
        });

        $(BZCHAT.element.chatMessage).empty();

        BZCHAT.User.Active = user_to_id;

    };

    BZCHAT.Message.notify = function (data) {

        

        var NotifyAll = 0;
        for (var user in data) {
            var number = data[user].length;
            NotifyAll += number;
            $('#unread-number-' + user).text(number > 0 ? number : '');
        }

        if (!NotifyAll) {
            $('.badge.notify-number').text('');
        }

        $('#all-notify').text(NotifyAll || '');


    };

    BZCHAT.Message.notifyMe = function (data) {
        var user = BZCHAT.fn.findObjectByKey(BZCHAT.User.Online, "id", data.user_from_id);
        var name = user.email.split("@")[0].capitalize();

        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {

            var notification = new Notification(name + " Said :", {
                icon: '/assets/img/ico-128.png',
                body: data.message,
            });

            setTimeout(function () {
                notification.close()
            }, 3000)
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {

                if (permission === "granted") {
                    var notification = new Notification(name + " Said :", {
                        icon: '/assets/img/ico-128.png',
                        body: data.message,
                    });

                    setTimeout(function () {
                        notification.close()
                    }, 3000)


                    //   notification.onclick = function () {
                    //     window.open("http://stackoverflow.com/a/13328397/1269037");      
                    //   };
                }
            });
        }
    };

    BZCHAT.socket.on('send.message', function (message) {
        if (BZCHAT.User.Active && BZCHAT.User.Active === message.user_from_id) { //if chat message box is open
            BZCHAT.Message.GET(message);
        } else { // if no send notification
            BZCHAT.socket.emit("chat.notify", message);

        }

    });

    BZCHAT.socket.on('get.notify', function (info) {
     
        setTimeout(function () {
            BZCHAT.Message.notify(info.data);
            BZCHAT.Message.notifyMe(info.message);
        }, 1000);

    });

    BZCHAT.Message.UpdateNotify = function () {
     
        setTimeout(function(){
            var notify = BZCHAT.GetUnreadMessage();
            BZCHAT.Message.notify(notify);
        },1500);

    };


})();




(function ($) {


    BZCHAT.Message.UpdateNotify();

    $(document).on('click', BZCHAT.element.chatContact + ' li a', function () {
        var userID = $(this).data('userid');
        BZCHAT.Message.Room(BZCHAT.SessionUser.id, userID);
        BZCHAT.Message.UpdateNotify();
    });

    $(BZCHAT.element.messageToSend).keydown(function (e) {
        if (e.keyCode === 13) {
            BZCHAT.Message.SEND();
            if (e.preventDefault) e.preventDefault(); 
            return false;
        }
    });

    $(document).on('click', BZCHAT.element.sendMessage, function () {
        BZCHAT.Message.SEND();
    });

    $(document).on('click', '[data-widget="chat-pane-toggle"]', function () {
        var box = $(this).parents('.direct-chat').first();
        box.toggleClass('direct-chat-contacts-open');
    });

    $('ul.contacts-list li').click(function () {
        $('.direct-chat').removeClass('direct-chat-contacts-open');
    });

})($);