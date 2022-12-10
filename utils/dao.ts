import { Task } from '@prisma/client'

export const apiPath = {
  task: '/api/task'
}

export const fetchTask = async () => {
  const res = await fetch(apiPath.task, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const tasks = (await res.json()) as Task[]
  return tasks
}

export const insertTask = async (param: Partial<Task>) => {
  const res = await fetch(apiPath.task, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(param)
  })
  return res
}

export const updateTask = async (param: Partial<Task>) => {
  const res = await fetch(apiPath.task, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(param)
  })
  return res
}

export const deleteTask = async (id: string,) => {
  const param: Partial<Task> = {
    id: id
  }
  const res = await fetch(apiPath.task, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(param)
  })
  return res
}
