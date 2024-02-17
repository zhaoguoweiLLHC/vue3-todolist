<script setup lang="ts">
import TodoListHooks from '@/hook/todolist';

const {data, addTodo} = TodoListHooks()

</script>

<template>
  <div class="todolist">
    <h1>This is an TodoList page</h1>
    <input class="new-todo" autofocus placeholder="What needs to be done?" @keyup.enter="addTodo">
  </div>
</template>

<style scoped src="../assets/todolist.css"></style>
<style>
@media (min-width: 1024px) {
  .todolist {
  }
}

</style>
