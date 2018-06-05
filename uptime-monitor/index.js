const fs = require('fs')
const http = require('http')
const https = require('https')
const { URL } = require('url')
const { StringDecoder } = require('string_decoder')
const config = require('./config')

// Instantiate the HTTP server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res)
})

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
    console.log(`HTTP server listening on port ${httpServer.address().port}, on the ${config.envName} environment...`)
})

// Instantiate the HTTPS server
const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res)
})

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
    console.log(`HTTPS server listening on port ${httpsServer.address().port}, on the ${config.envName} environment...`)
}) 

// All the server logic for both the http and https server
const unifiedServer = (req, res) => {

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

        // Choose the handler this request should go to. If not found, use notFound handler
        const chosenHandler = path in handlers ? handlers[path] : handlers.notFound
        
        // Construct the data object to send to the handler
        const data = {
            'path': path,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        }

        // Log the request
        console.log(`\n${method} request received on path /${path}`)
        // Log query string parameters, if any
        const hasQuery = Object.keys(queryStringObject).length > 0
        hasQuery && console.log(`Query string parameters: ${JSON.stringify(queryStringObject)}`)
        // Log payload, if any
        const hasPayload = buffer.length
        hasPayload && console.log(`Payload:\n${buffer}`)

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200

            // Use the payload called back by the handler, or default to empty object
            payload = typeof(payload) == 'object' ? payload : {}

            // Convert payload to string
            const payloadString = JSON.stringify(payload)

            // Return the response
            res.writeHead(statusCode, { 'Content-Type': 'application/json' })
            res.end(payloadString)

            console.log(`\nReturning this response: ${statusCode} ${payloadString}`)
        })
    })
}

// Define the handlers
const handlers = {

    // Ping handler
    'ping': (data, callback) => { callback(200) },

    // Not found handler
    'notFound': (data, callback) => { callback(404) }
}

// Define request router
const router = {
    'ping': handlers.ping
}