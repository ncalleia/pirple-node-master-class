const http = require('http')
const { URL } = require('url')
const { StringDecoder } = require('string_decoder')

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

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8')
    let buffer = ''
    req.on('data', data => { buffer += decoder.write(data) })
    req.on('end', () => { 
        buffer += decoder.end()

        // Send the response
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Hello, world!\n')
        
        // Log the request
        console.log(`\n${method} request received on path /${path}`)
        // Log query string parameters, if any
        const hasQuery = Object.keys(queryStringObject).length > 0
        hasQuery && console.log(`Query string parameters: ${JSON.stringify(queryStringObject)}`)
        // Log payload, if any
        const hasPayload = buffer.length
        hasPayload && console.log(`Payload:\n${buffer}`)
    })
})

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
    console.log(`Listening on port ${server.address().port}...`)
})