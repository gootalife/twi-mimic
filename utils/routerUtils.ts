
export const getRedirectParam = (path: string) => {
  return {
    redirect: {
      destination: path,
      permanent: false
    }
  }
}