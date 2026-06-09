import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from './ui/card'

type Props = {
  id: string
  title: string
  date: string
  summary: string
}

export default function NoteCard({
  id,
  title,
  date,
  summary,
}: Props) {
  const navigate = useNavigate()

  return (
    <Card
      onClick={() =>
        navigate(`/notes/${id}`)
      }
      className="cursor-pointer hover:shadow-lg transition"
    >
      <CardContent className="p-5">
        <p className="text-sm text-gray-500">
          {date}
        </p>

        <h3 className="font-semibold text-lg mt-2">
          {title}
        </h3>

        <p className="text-gray-600 mt-2">
          {summary}
        </p>
      </CardContent>
    </Card>
  )
}