import type { IntTodoList } from "@/type/todolist";
import { reactive } from "vue"

export default function TodoListHooks() {

    type DataType = {
        list: IntTodoList[];
        toAddData: IntTodoList;
    }

    const data = reactive<DataType>({
        list:[],
        toAddData: {
            id: 0,
            title: '',
            isFinished: false
        }
    })

    function addTodo(){
        data.list.push({...data.toAddData,id: data.list.length+1})
    }

    return {data,addTodo}
}