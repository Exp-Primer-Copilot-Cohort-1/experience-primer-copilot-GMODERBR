// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var comments = [];
var server = http.createServer(function (req, res) {
    // Parse the url
    var parseObj = url.parse(req.url, true);
    // Get the path of the request
    var pathname = parseObj.pathname;
    if (pathname === '/') {
        fs.readFile('./views/index.html', function (err, data) {
            if (err) {
                return res.end('404 Not Found.');
            }
            var htmlStr = template.render(data.toString(), {
                comments: comments
            });
            res.end(htmlStr);
        });
    } else if (pathname === '/post') {
        fs.readFile('./views/post.html', function (err, data) {
            if (err) {
                return res.end('404 Not Found.');
            }
            res.end(data);
        });
    } else if (pathname.indexOf('/public/') === 0) {
        fs.readFile('.' + pathname, function (err, data) {
            if (err) {
                return res.end('404 Not Found.');
            }
            res.end(data);
        });
    } else if (pathname === '/pinglun') {
        // Get the data submitted by the user
        // Get the query string parameters
        var comment = parseObj.query;
        comment.dateTime = '2019-09-25';
        comments.unshift(comment);
        // Redirect to the homepage
        // 1. Status code 302 临时重定向
        // 2. 在响应头中通过 Location 告诉客户端往哪儿重定向
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
    } else {
        fs.readFile('./views/404.html', function (err, data) {
            if (err) {
                return res.end('404 Not Found.');
            }
            res.end(data);
        });
    }
});
server.listen(3000, function () {
    console.log('Server is running...');
});
// Define a template engine
var template = {
    render: function (tplStr, obj) {
        return tplStr.replace(/{{(.*?)}}/g, function () {
            return obj[arguments[1]];
        });
    }
}; 
// Create a 404.html file
