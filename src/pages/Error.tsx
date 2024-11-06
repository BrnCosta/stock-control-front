import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()

  console.error(error)

  return (
    <div
      id="error-page"
      className="h-screen flex flex-col items-center justify-center gap-10"
    >
      <span className="text-red-600 text-9xl">
        {isRouteErrorResponse(error) ? error.status : '520'}
      </span>
      <div className="flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">Oops!</span>
        <p>Sorry, an error has occurred.</p>
        <p>
          <i>{isRouteErrorResponse(error) ? error.data : 'Unknown error'}</i>
        </p>
      </div>
      <Link to={'/'}>
        <span className="underline hover:cursor-pointer text-xl">
          RETURN TO HOME
        </span>
      </Link>
    </div>
  )
}
