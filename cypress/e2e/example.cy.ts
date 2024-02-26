// https://on.cypress.io/api

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
    cy.get('.todoapp>.header>h1').should('have.text', 'Todos')
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
    cy.get('.todo-list>.todo:last-child .destroy').should('be.visible').click()
    cy.get('.todo-list>.todo').should('have.length', 0)
  })

  it('edit todo', () => {
    cy.get('.new-todo').type(`add 1{enter}`)
    cy.get('.todo-list>.todo:last-child>.view>label').dblclick()
    cy.get('.todo-list>.todo:last-child>.edit').should('be.visible').type('edit blur')
    cy.get('.todo-list>.todo:last-child>.edit').blur()
    cy.get('.todo-list>.todo:last-child>.view>label').should('have.text', 'add 1edit blur')
  })

  it('edit todo enter', () => {
    cy.get('.new-todo').type(`add 1{enter}`)
    cy.get('.todo-list>.todo:last-child>.view>label').dblclick()
    cy.get('.todo-list>.todo:last-child>.edit').type('edit enter{enter}')
    cy.get('.todo-list>.todo:last-child>.view>label').should('have.text', 'add 1edit enter')
  })

  it('edit todo esc', () => {
    cy.get('.new-todo').type(`add 1{enter}`)
    cy.get('.todo-list>.todo:last-child>.view>label').dblclick()
    cy.get('.todo-list>.todo:last-child>.edit').type('edit cancel{esc}')
    cy.get('.todo-list>.todo:last-child>.view>label').should('have.text', 'add 1')
  })
})

describe('todolist-hook', () => {
  beforeEach(() => {
    cy.visit('/todolist-hook')
  })
  it('visits the todolist-hook', () => {
    cy.get('.todoapp>.header>h1').should('have.text', 'Todos hook')
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
    cy.get('.todo-list>.todo:last-child .destroy').should('be.visible').click()
    cy.get('.todo-list>.todo').should('have.length', 0)
  })

  it('edit todo', () => {
    cy.get('.new-todo').type(`add 1{enter}`)
    cy.get('.todo-list>.todo:last-child>.view>label').dblclick()
    cy.get('.todo-list>.todo:last-child>.edit').should('be.visible').type('edit blur')
    cy.get('.todo-list>.todo:last-child>.edit').blur()
    cy.get('.todo-list>.todo:last-child>.view>label').should('have.text', 'add 1edit blur')
  })

  it('edit todo enter', () => {
    cy.get('.new-todo').type(`add 1{enter}`)
    cy.get('.todo-list>.todo:last-child>.view>label').dblclick()
    cy.get('.todo-list>.todo:last-child>.edit').type('edit enter{enter}')
    cy.get('.todo-list>.todo:last-child>.view>label').should('have.text', 'add 1edit enter')
  })

  it('edit todo esc', () => {
    cy.get('.new-todo').type(`add 1{enter}`)
    cy.get('.todo-list>.todo:last-child>.view>label').dblclick()
    cy.get('.todo-list>.todo:last-child>.edit').type('edit cancel{esc}')
    cy.get('.todo-list>.todo:last-child>.view>label').should('have.text', 'add 1')
  })
})
