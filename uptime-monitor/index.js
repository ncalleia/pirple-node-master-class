const http = require('http')
const { URL } = require('url')

// The server should respond to all requests with a string
const server = http.createServer((req, res) => {

    // Get the URL and parse it
    const parsedUrl = new URL(`localhost:${req.url}`)

    // Get the path
    const path = parsedUrl.pathname.replace(/^\/|\/+$/g, '')

    // Get the HTTP method
    const method = req.method.toUpperCase()

    // Send the response
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello, world!\n')

    // Log the request path
    console.log(`${method} request received on path: ${path}`)
})

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
    console.log(`Listening on port ${server.address().port}...`)
})