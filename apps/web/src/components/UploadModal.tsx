import { useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onUploadSuccess: () => void
}

export default function UploadModal({
  open,
  onClose,
  onUploadSuccess,
}: Props) {
  const [file, setFile] =
    useState<File | null>(null)

  const [loading, setLoading] =
    useState(false)

  const uploadFile = async () => {
    if (!file) return

    try {
      setLoading(true)

      const token =
        localStorage.getItem('token')

      const formData =
        new FormData()

      formData.append('file', file)

      const res = await fetch(
        'http://127.0.0.1:8787/upload',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const data =
        await res.json()

      console.log(data)

      alert('Upload Successful!')

      onUploadSuccess()
      onClose()
    } catch (err) {
      console.error(err)

      alert('Upload Failed')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-2xl font-bold mb-4">
          Upload Notes
        </h2>

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.txt"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] || null
            )
          }
        />

        {file && (
          <div className="mt-4">
            <p>
              <strong>Name:</strong>{' '}
              {file.name}
            </p>

            <p>
              <strong>Size:</strong>{' '}
              {(
                file.size /
                1024 /
                1024
              ).toFixed(2)}
              MB
            </p>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button
            onClick={uploadFile}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading
              ? 'Uploading...'
              : 'Upload'}
          </button>

          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}