// perform the loading of saved texts from chrome, as well as the editing of the little menu in this file

const fetchData = async () => {
    // get texts from chrome and insert into document
    const savedTexts = await chrome.storage.sync.get(['savedtexts'])
    console.log('savedTextsObj: ', savedTexts)
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

        textContainer.appendChild(textElement)
        textContainer.appendChild(updateBtn)
        textContainer.appendChild(deleteBtn)
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

// const handleUpdateTextObj = async (id) => {
//     const allTexts = await chrome.storage.sync.get(['savedtexts'])
//     // console.log('ID TO UPDATE: ', id)
//     // console.log('text obj')
//     const textObjToUpdate = allTexts.savedtexts.filter(textObj => textObj.id === id)[0]
    
//     const textContainer = document.getElementById(id)
//     textContainer.innerHTML = ""

//     const editTextContainer = document.createElement('div')
//     editTextContainer.setAttribute('class', 'edit-text-container')

//     const editTextArea = document.createElement('textarea')
//     editTextArea.setAttribute('id', `textarea-${id}`)
//     editTextArea.value = textObjToUpdate.text

//     const finishEditingBtn = document.createElement('button')
//     finishEditingBtn.innerText = "Finish"
//     finishEditingBtn.addEventListener('click', () => submitUpdatedText(id, text))

//     editTextContainer.appendChild(editTextArea)
//     editTextContainer.appendChild(finishEditingBtn)
//     textContainer.appendChild(editTextContainer)

// }

// const submitUpdatedText = (id) => {
//     // console.log('Submit this change')
//     const editTextArea = document.getElementById(`textarea-${id}`)
// }

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'updateTexts') {
//         // call a function that re-populates the texts
//     }
// })
