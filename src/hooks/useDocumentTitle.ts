import { useEffect, useRef } from 'react'

/**
 * Sets the document title. Restores previous title on unmount.
 */
export function useDocumentTitle(title: string) {
  const prevRef = useRef(document.title)

  useEffect(() => {
    document.title = title
    return () => {
      document.title = prevRef.current
    }
  }, [title])
}
