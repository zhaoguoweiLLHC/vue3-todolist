<script setup lang="ts">
import type { TodoItem } from '@/type/todolist'
import { ref, computed, watchEffect, onUnmounted } from 'vue'

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

function editTodo(todo: TodoItem) {
  editedTodo.value = JSON.parse(JSON.stringify(todo))
}

function removeTodo(todo: TodoItem) {
  todos.value.splice(todos.value.indexOf(todo), 1)
}

function doneEdit(todo: TodoItem) {
  if(!editedTodo.value) return;
  const title = editedTodo.value.title.trim()
  if (title) todo.title = title
  else removeTodo(todo)
  editedTodo.value = null
}

function cancelEdit() {
  editedTodo.value = null
}

function removeCompleted() {
  todos.value = filters.active(todos.value)
}

// 状态持久化
watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
})

function onHashChange() {
  const route = window.location.hash.replace(/#\/?/, '') as keyof typeof filters
  if (filters[route]) {
    visibility.value = route
  } else {
    window.location.hash = ''
    visibility.value = 'all'
  }
}

onHashChange()

// 处理路由
window.addEventListener('hashchange', onHashChange)
onUnmounted(() => {
  window.removeEventListener('hashchange', onHashChange)
})

function onFoucs({ el }: { el: HTMLInputElement }) {
  el.focus()
}
</script>

<template>
  <section class="todoapp">
    <header class="header">
      <h1>Todos1</h1>
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
          :class="{ completed: todo.completed, editing: todo.id === editedTodo?.id }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input
            v-if="todo.id === editedTodo?.id"
            class="edit"
            type="text"
            v-model="editedTodo.title"
            @vue:mounted="onFoucs"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.escape="cancelEdit"
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
