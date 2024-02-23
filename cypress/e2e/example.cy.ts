// https://on.cypress.io/api

interface TodoItem {
  id: number
  title: string
  completed: boolean
}

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'You did it!')
  })
})

describe('todolist', () => {
  beforeEach(() => {
    cy.visit('/todolist')
  })

  it('visits the todolist', () => {
    cy.contains('h1', 'Todos')
  })

  it('check list data', () => {
    const STORAGE_KEY = 'vue-todomvc'
    const list: TodoItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (list.length > 0) {
      cy.get('.todo-list>.todo').should('have.length', list.length)
    }
  })

  it('add todo', () => {
    const text = 'add 1'
    cy.get('.new-todo').type(`${text}{enter}`)
    cy.get('.todo-list>.todo:last-child').should('have.text', text)
  })

  it('delete todo', () => {
    cy.get('.new-todo').type(`add 1{enter}`)
    cy.get('.todo-list>.todo').should('have.length', 1)
    cy.get('.todo-list>.todo:last-child').realHover()
    cy.get('.todo-list>.todo:last-child .destroy').should('be.visible')
    cy.get('.todo-list>.todo:last-child .destroy').click()
    cy.get('.todo-list>.todo').should('have.length', 0)
  })

  it('edit todo', () => {
    
  })
})

describe('todolist-hook', () => {
  beforeEach(() => {
    cy.visit('/todolist-hook')
  })
  it('visits the todolist-hook', () => {
    cy.contains('h1', 'Todos hook')
  })

  it('check list data', () => {})
})
