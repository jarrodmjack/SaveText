// THIS IS THE FUNCTION THAT RUNS WHEN THE BUTTON IN THE USERS RIGHT CLICK MENU IS PRESSED
const saveText = async (selection) => {
    const currentTexts = await chrome.storage.sync.get(['savedtexts']) // Object with ARRAY OF TEXT OBJECTS EG [{id:text}]

    const newTextObject = {
        id: generateGuid(),
        text: selection.selectionText,
    }

    if (!Object.keys(currentTexts).length > 0) {
        // first time adding a text
        const textArray = [newTextObject]
        await chrome.storage.sync.set({ savedtexts: textArray })
        const newTextsObjAfterSaving = await chrome.storage.sync.get([
            'savedtexts',
        ])
    } else {
        //add the new text object to the already existing array of saved texts
        const textArray = [...currentTexts.savedtexts, newTextObject]
        await chrome.storage.sync.set({ savedtexts: textArray })
    }

    // At this point, all are being stored in chrome storage
    chrome.runtime.sendMessage({ action: 'updateTexts' })
}

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

chrome.contextMenus.removeAll(function () {
    chrome.contextMenus.create({
        id: '1',
        title: 'Save Text!',
        contexts: ['selection'], // ContextType
    })
})

chrome.contextMenus.onClicked.addListener(saveText)
