var net     = require('net');
var clients = [];

net.createServer(function (sock) {

    sock.name = 'visitor_' + clients.length;

    clients.push(sock);

    sock.on('data', function (data) {
        var regName = new RegExp("^/myname=[a-zA-Z0-9_]+");
        if (null != data.toString().match(regName)) {
            sock.oldName = sock.name;
            sock.name = data.toString().replace('/myname=', '');
            sock.name = sock.name.replace('\n', '');
        } else {
            talk(data, sock);
        }
    });

    function talk(message, socket)
    {
        clients.forEach(function (client) {
            if (socket !== client) {
                client.write(socket.name + '> ' + message);
            }
        });
        log(socket.name + ' said: ' + message);
    }

    function log(message)
    {
        console.log(message);
    }

}).listen(8080);
