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
    const title = editedTodo.value!.title.trim()
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
