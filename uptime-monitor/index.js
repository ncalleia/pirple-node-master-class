const http = require('http')
const { URL } = require('url')

// The server should respond to all requests with a string
const server = http.createServer((req, res) => {

    // Get the URL and parse it
    const parsedUrl = new URL(`localhost:${req.url}`)

    // Get the path
    const path = parsedUrl.pathname.replace(/^\/|\/+$/g, '')

    // Get query string as an object
    let queryStringObject = {}
    parsedUrl.searchParams.forEach((key, value) => {queryStringObject[key] = value})

    // Get the HTTP method
    const method = req.method.toUpperCase()

    // Get the headers as an object
    const headers = req.headers

    // Send the response
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello, world!\n')

    // Log the request
    const hasQuery = Object.keys(queryStringObject).length > 0
    console.log(`${method} request received on path ${path}${hasQuery ?
        `, with these query string parameters: ${JSON.stringify(queryStringObject)}` : ''}`)
})

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
    console.log(`Listening on port ${server.address().port}...`)
})