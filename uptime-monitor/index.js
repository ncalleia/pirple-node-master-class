const http = require('http')

// The server should respond to all requests with a string
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello, world!\n')
})

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
    console.log(`Listening on port ${server.address().port}...`)
})