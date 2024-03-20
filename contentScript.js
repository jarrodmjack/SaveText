// (() => {
//     console.log('HELLO # 1')
//     chrome.runtime.onMessage.addListener(function (
//         request,
//         sender,
//         sendResponse
//     ) {
//         console.log({ request })
//         if (request.action === 'saveText') {
//             // Assuming request.html contains the HTML string to be inserted
//             const div = document.createElement('div')
//             div.innerHTML = request.html
//             document.body.appendChild(div)
//         }
//     })

// })()

chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
) {
    console.log({ request })
    if (request.action === 'saveText') {
        // Assuming request.html contains the HTML string to be inserted
        const div = document.createElement('div')
        div.innerHTML = request.html
        document.body.appendChild(div)
    }
})