chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'insertHTML') {
        // Assuming request.html contains the HTML string to be inserted
        const div = document.createElement('div')
        div.innerHTML = request.html
        document.body.appendChild(div)
    }
})
