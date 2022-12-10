import { Task } from '@prisma/client'
import useSWR from 'swr'
import { ToDoItem } from 'components/ToDoItem'
import { apiPath } from 'utils/dao'
import { Box } from '@mui/material'

const isArray = <T,>(maybeArray: T | readonly T[]): maybeArray is T[] => {
  return Array.isArray(maybeArray)
}

export const ToDoList = () => {
  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return res.json()
  }
  const { data: tasks } = useSWR<Task[]>(apiPath.task, fetcher, { suspense: true })

  return (
    <>
      <hr />
      {tasks && isArray<Task>(tasks) && (
        <>
          {tasks?.map((task) => (
            <Box key={`hr_${task.id}`}>
              <ToDoItem key={task.id} task={task}></ToDoItem>
              <hr />
            </Box>
          ))}
        </>
      )}
    </>
  )
}
