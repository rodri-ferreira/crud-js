'use strict'

//interação com o layout

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id= "delete-${index}">Excluir</button>
        </td>`

    document.querySelector('#tbClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tbClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = '')
}

const saveClient = () => {
    if(isValidFiels()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if(index == 'new'){
            createClient(client)
            clearFields()
            closeModal()
            updateTable()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

const isValidFiels = () => {
    return document.getElementById('form').reportValidity()
}

// create 

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [] // função resposável por verificar se existe um banco criado e pegar os elementos transformar em um obj com o método JSON.parse()

const setLocalStorage = (dbClient) => localStorage.setItem('db_client', JSON.stringify(dbClient)) //função responsável por adicionar um elemento ao localStorage. neste caso ele irá receber um array como argumento


// crud creat
const createClient = (client) => {
    const dbClient = getLocalStorage() // pegando o que está no localstorage e transformando em array
    dbClient.push(client) // adicionando um novo cliente a esse array
    setLocalStorage(dbClient) // subindo esse array para o banco através da função setLocalStorage criada a cima
}

//crud read
const readClient = () => getLocalStorage()

//crud update
const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()

}

//crud delete
const deleter = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    document.getElementById('modal').classList.remove('active')
    clearFields()
}

document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)  


const updateTable = () => {
    clearTable()
    const dbClient = readClient()
    dbClient.forEach(createRow)
}

const editDelete = (e) => {
    if(e.target.type == 'button') {
        const [action, index] = e.target.id.split('-')

        if(action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if(response){
                deleter(index)
                updateTable()
            }

            
        }
    }
}

updateTable()  

document.querySelector('#tbClient>tbody').addEventListener('click', editDelete)


