import type { TodoItem } from '@/type/todolist'
import { computed, ref, watchEffect } from 'vue'

const STORAGE_KEY = 'vue-todomvc'

const filters = {
  all: (todos: TodoItem[]) => todos,
  active: (todos: TodoItem[]) => todos.filter((todo) => !todo.completed),
  completed: (todos: TodoItem[]) => todos.filter((todo) => todo.completed)
}

export default function TodoListHooks() {
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
    const input = e.target as HTMLInputElement
    todos.value.forEach((todo) => (todo.completed = input.checked))
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
      todo.title = todo.title.trim()
      if (!todo.title) removeTodo(todo)
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

  return {
    todos,
    remaining,
    filteredTodos,
    editedTodo,
    visibility,
    addTodo,
    toggleAll,
    editTodo,
    removeTodo,
    doneEdit,
    cancelEdit,
    removeCompleted
  }
}
