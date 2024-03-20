chrome.contextMenus.removeAll(function () {
    chrome.contextMenus.create({
        id: 'saveHTML',
        title: 'Save Text!',
        contexts: ['selection'], // ContextType
    })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'saveHTML') {
        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },
                function: getSelectedHTML,
            },
            async ([result]) => {
                // Save the result (HTML) to your extension's storage or handle it as needed
                const currentTexts = await chrome.storage.sync.get([
                    'savedtexts',
                ]) // Object with ARRAY OF TEXT OBJECTS EG [{id:text}]
                // console.log('current textts: ', currentTexts)
                const newTextObject = {
                    id: generateGuid(),
                    text: result.result,
                }

                if (!Object.keys(currentTexts).length > 0) {
                    // first time adding a text
                    const textArray = [newTextObject]
                    await chrome.storage.sync.set({ savedtexts: textArray })
                } else {
                    //add the new text object to the already existing array of saved texts
                    const textArray = [
                        ...currentTexts.savedtexts,
                        newTextObject,
                    ]
                    await chrome.storage.sync.set({ savedtexts: textArray })
                }

                // At this point, all are being stored in chrome storage
                // chrome.runtime.sendMessage({ action: 'updateTexts' })
                // chrome.tabs.sendMessage({ action: 'tacos' })
                ;(async () => {
                    const [tab] = await chrome.tabs.query({
                        active: true,
                        lastFocusedWindow: true,
                    })
                    const response = await chrome.tabs.sendMessage(tab.id, {
                        greeting: 'hello',
                        action: 'saveText',
                    })
                    // do something with response here, not outside the function
                    console.log(response)
                })()
            }
        )
    }
})

var generateGuid = function () {
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
        }
    )
    return uuid
}

function getSelectedHTML() {
    const selection = window.getSelection()
    if (!selection.rangeCount) return null // checking if there is text selected or not. rangecount > 1 means text is selected
    const range = selection.getRangeAt(0) // first range, aka only the first bit of selected text
    const clonedSelection = range.cloneContents()
    const div = document.createElement('div')
    div.appendChild(clonedSelection)
    return div.innerHTML
}
