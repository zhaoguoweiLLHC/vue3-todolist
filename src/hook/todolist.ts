import type { IntTodoList } from '@/type/todolist'
import { reactive, watchEffect } from 'vue'

const STORAGE_KEY = 'vue-todomvc'

export default function TodoListHooks() {
  const todos = reactive<IntTodoList[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

  function addTodo(e: KeyboardEvent): void {
    const input = e.target as HTMLInputElement
    const value = input.value.trim()
    if (value) {
      todos.push({
        id: Date.now(),
        title: value,
        completed: false
      })
      input.value = ''
    }
  }

  // 状态持久化
  watchEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  })

  return { todos, addTodo }
}
