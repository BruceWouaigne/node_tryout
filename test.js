var net     = require('net');
var clients = [];

net.createServer(function (sock) {

    sock.name = 'visitor_' + clients.length;

    clients.push(sock);

    sock.on('data', function (data) {

        var regName = new RegExp("^/myname=[a-zA-Z0-9_]+");

        /**
         * Change my name
         */
        if (null != data.toString().match(regName)) {
            changeName(data, sock);
        /**
         * Talk
         */
        } else {
            broadcast(sock.name + '> ' + data, sock);
        }

    });

    function changeName(data, socket)
    {
        var newName = data[0].replace('/myname=', '');
        notify(socket.name  + ' is now ' + newName, socket);
        socket.name = newName;
    }

    function notify(message, socket)
    {
        broadcast('[' + message + ']', socket);
    }

    function broadcast(message, socket)
    {
        clients.forEach(function (client) {
            if (socket !== client) {
                client.write(message);
            }
        });
        console.log(message);
    }

}).listen(8080);
