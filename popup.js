// perform the loading of saved texts from chrome, as well as the editing of the little menu in this file

const fetchData = async () => {
    // get texts from chrome and insert into document
    const savedTexts = await chrome.storage.sync.get(['savedtexts'])
    displayTexts(savedTexts.savedtexts)
}
fetchData()

const displayTexts = (textsArr) => {
    let allTextsContainer = document.querySelector('.all-texts-container')
    for (let textObj of textsArr) {
        const textContainer = document.createElement('div')
        textContainer.setAttribute('class', 'text-container')
        textContainer.setAttribute('id', textObj.id)

        const textElement = document.createElement('div')
        textElement.setAttribute('id', textObj.id)
        textElement.innerText = textObj.text

        const btnContainer = document.createElement('div')
        btnContainer.setAttribute('class', 'btn-container')

        const deleteBtn = document.createElement('button')
        deleteBtn.innerText = 'DEL' // this will become an icon eventually
        deleteBtn.addEventListener('click', () =>
            handleDeleteTextObj(textObj.id)
        )

        const updateBtn = document.createElement('button')
        updateBtn.innerText = 'UPD' // this will become an icon eventually
        updateBtn.addEventListener('click', () =>
            handleUpdateTextObj(textObj.id)
        )

        btnContainer.appendChild(updateBtn)
        btnContainer.appendChild(deleteBtn)
        textContainer.appendChild(textElement)
        textContainer.appendChild(btnContainer)
        allTextsContainer.appendChild(textContainer)
    }
}

const handleDeleteTextObj = async (id) => {
    const allTexts = await chrome.storage.sync.get(['savedtexts'])
    const filteredTexts = allTexts.savedtexts.filter(
        (textObj) => textObj.id !== id
    )
    await chrome.storage.sync.set({ savedtexts: filteredTexts })
    let allTextsContainer = document.querySelector('.all-texts-container')
    allTextsContainer.innerHTML = ''
    fetchData()
}

const handleUpdateTextObj = async (id) => {
    const editModal = document.createElement('div')
    editModal.setAttribute('class', 'edit-saved-text-modal')

    const mainContainer = document.querySelector('.main-container')
    mainContainer.appendChild(editModal)

    const allTexts = await chrome.storage.sync.get(['savedtexts'])
    const textObjToUpdate = allTexts.savedtexts.filter(
        (textObj) => textObj.id === id
    )[0]

    const editTextArea = document.createElement('textarea')
    editTextArea.value = textObjToUpdate.text
    editModal.appendChild(editTextArea)

    const submitChangesBtn = document.createElement('button')
    submitChangesBtn.innerText = 'Submit'
    submitChangesBtn.addEventListener('click', async () => {
        textObjToUpdate.text = editTextArea.value
        await chrome.storage.sync.set({
            savedtexts: [
                textObjToUpdate,
                ...allTexts.savedtexts.filter((textObj) => textObj.id !== id),
            ],
        })
        editModal.remove()
        let allTextsContainer = document.querySelector('.all-texts-container')
        allTextsContainer.innerHTML = ""
        fetchData()
    })
    editModal.appendChild(submitChangesBtn)
}

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'updateTexts') {
//         // call a function that re-populates the texts
//     }
// })
