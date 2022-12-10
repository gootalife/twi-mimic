import Head from 'next/head'
import { Button, CircularProgress, Grid } from '@mui/material'
import { Suspense } from 'react'
import { apiPath, insertTask } from 'utils/dao'
import { useTaskForm } from 'hooks/taskFormHook'
import { useAlert } from 'hooks/alertHook'
import { Task } from '@prisma/client'
import { LibraryAdd } from '@mui/icons-material'
import { mutate } from 'swr'
import { GetServerSideProps } from 'next'
import { path } from 'utils/path'
import { ErrorBoundary } from 'react-error-boundary'
import dynamic from 'next/dynamic'
import { Session, unstable_getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
const ToDoList = dynamic(
  async () => {
    return (await import('components/ToDoList')).ToDoList
  },
  {
    ssr: false
  }
)

type Props = {
  session: Session | null
}

const ToDo: React.FC<Props> = ({ session }) => {
  const [openTaskForm, renderTaskForm] = useTaskForm()
  const [openAlertDialog, renderAlertDialog] = useAlert()

  const clickInsert = async () => {
    const task = await openTaskForm('TaskForm', 'Input items', undefined)
    if (!task || !session) {
      return
    }
    if (task.title === '' || task.content === '') {
      await openAlertDialog('Error', 'Input is invalid.')
      return
    }
    const param: Partial<Task> = {
      title: task.title,
      content: task.content
    }
    try {
      const res = await insertTask(param)
      if (res.ok) {
        await openAlertDialog('Completed', 'Save completed.')
        mutate(apiPath.task)
      } else {
        throw new Error()
      }
    } catch (err) {
      await openAlertDialog('Error', 'Failed.')
    }
  }

  return (
    <>
      <Head>
        <title>ToDoApp</title>
      </Head>
      <h1>ToDo List</h1>
      <Grid container justifyContent="flex-end">
        <Button variant="contained" onClick={clickInsert} startIcon={<LibraryAdd />}>
          Add
        </Button>
      </Grid>
      <ErrorBoundary fallback={<></>}>
        <Suspense fallback={<CircularProgress color="inherit" />}>
          <ToDoList></ToDoList>
        </Suspense>
      </ErrorBoundary>
      {renderTaskForm()}
      {renderAlertDialog()}
    </>
  )
}

export default ToDo

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: path.home,
        permanent: false
      }
    }
  }
  const props: Props = { session: session }
  return { props: props }
}
