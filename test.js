var net     = require('net');
var clients = [];

net.createServer(function (sock) {

    sock.name = 'visitor_' + clients.length;
    clients.push(sock);
    notify(sock.name + ' joined the room', sock);
    notifyUser('Welcome ' + sock.name + '!', sock);
    notifyUser('Type /help to display the command list.', sock);


    sock.on('data', function (data) {
        data = data.toString().replace('\r', '');
        data = data.toString().replace('\n', '');

        if ('' != data.trim()) {
            var regName = new RegExp('^/myname=[a-zA-Z0-9_]+');
            var regQuit = new RegExp('^/(quit|exit)$');
            var regHelp = new RegExp('^/help$');

            /**
             * Change my name
             */
            if (null != data.toString().match(regName)) {
                changeName(data, sock);
            /**
             * Quit
             */
            } else if (null != data.toString().match(regQuit)) {
                sock.end();
            /**
             * Help
             */
            } else if (null != data.toString().match(regHelp)) {
                notifyUser('**************************************************', sock);
                notifyUser('********************** HELP **********************', sock);
                notifyUser('**************************************************', sock);
                notifyUser('***                                            ***', sock);
                notifyUser('*** /myname=[new name] --> change your name    ***', sock);
                notifyUser('*** /quit              --> quit the chat       ***', sock);
                notifyUser('*** /exit              --> /quit alias         ***', sock);
                notifyUser('*** /help              --> display this screen ***', sock);
                notifyUser('***                                            ***', sock);
                notifyUser('**************************************************', sock);
                notifyUser('**************************************************', sock);
            /**
             * Talk
             */
            } else {
                broadcast(sock.name + '> ' + data, sock);
            }
        }

    });

    sock.on('end', function () {
        clients.splice(clients.indexOf(sock), 1);
        notify(sock.name + " left the room");
    });

    function changeName(data, socket)
    {
        var newName = data.toString().replace('/myname=', '');

        if (true == isNameExists(newName)) {
            notifyUser('Sorry, ' + newName + " is already taken\n");
        } else {
            notify(socket.name  + ' is now ' + newName, socket);
            socket.name = newName;
        }
    }

    function notify(message, socket)
    {
        broadcast('[' + message + ']', socket);
    }

    function notifyUser(message, socket)
    {
        socket.write(message + '\n');
    }

    function broadcast(message, socket)
    {
        clients.forEach(function (client) {
            if (socket !== client) {
                client.write(message + '\n');
            }
        });
        console.log(message);
    }

    function isNameExists(name)
    {
        for (i=0; i<clients.length; i++) {
            if (name == clients[i].name) {
                return true;
            }
        }
        return false;
    }

}).listen(8080);
