<script setup lang="ts">
import type { TodoItem } from '@/type/todolist'
import { ref, computed, watchEffect } from 'vue'

const STORAGE_KEY = 'vue-todomvc'

const filters = {
  all: (todos: TodoItem[]) => todos,
  active: (todos: TodoItem[]) => todos.filter((todo) => !todo.completed),
  completed: (todos: TodoItem[]) => todos.filter((todo) => todo.completed)
}

const todos = ref<TodoItem[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
const visibility = ref<keyof typeof filters>('all')
const editedTodo = ref<TodoItem | null>(null)

const remaining = computed(() => filters.active(todos.value).length)
const filteredTodos = computed(() => filters[visibility.value](todos.value))

function addTodo(e: KeyboardEvent): void {
  const input = e.target as HTMLInputElement
  const value = input.value.trim()
  if (value) {
    todos.value.push({
      id: Date.now(),
      title: value,
      completed: false
    })
    input.value = ''
  }
}

function toggleAll(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  todos.value.forEach((todo) => (todo.completed = checked))
}

let beforeEditCache = ''

function editTodo(todo: TodoItem) {
  beforeEditCache = todo.title
  editedTodo.value = todo
}

function removeTodo(todo: TodoItem) {
  todos.value.splice(todos.value.indexOf(todo), 1)
}

function doneEdit(todo: TodoItem) {
  if (editedTodo.value) {
    editedTodo.value = null
    const title = todo.title.trim()
    if (title) todo.title = title
    else removeTodo(todo)
  }
}

function cancelEdit(todo: TodoItem) {
  editedTodo.value = null
  todo.title = beforeEditCache
}

function removeCompleted() {
  todos.value = filters.active(todos.value)
}

// 状态持久化
watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
})

// 处理路由
window.addEventListener('hashchange', onHashChange)
onHashChange()

function onHashChange() {
  const route = window.location.hash.replace(/#\/?/, '') as keyof typeof filters
  if (filters[route]) {
    visibility.value = route
  } else {
    window.location.hash = ''
    visibility.value = 'all'
  }
}

function onFoucs({ el }: { el: HTMLInputElement }) {
  el.focus()
}
</script>

<template>
  <section class="todoapp">
    <header class="header">
      <h1>Todos</h1>
      <input
        class="new-todo"
        autofocus
        placeholder="What needs to be done?"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="main" v-show="todos.length">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        :checked="remaining === 0"
        @change="toggleAll"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="todo in filteredTodos"
          class="todo"
          :key="todo.id"
          :class="{ completed: todo.completed, editing: todo === editedTodo }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input
            v-if="todo === editedTodo"
            class="edit"
            type="text"
            v-model="todo.title"
            @vue:mounted="onFoucs"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.escape="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        <span> item{{ remaining === 1 ? '' : 's' }} left</span>
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility === 'all' }">All</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility === 'active' }">Active</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility === 'completed' }">Completed</a>
        </li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<style scoped src="@/assets/todolist.css"></style>
