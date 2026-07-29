import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  wrapperClassName?: string
  /** Aspect ratio as a string e.g. "16/9", "4/3", "1/1" — sets padding-bottom trick */
  aspectRatio?: string
  /** Fallback placeholder color when image hasn't loaded */
  placeholder?: string
}

export function LazyImage({
  src,
  alt,
  className,
  wrapperClassName,
  aspectRatio,
  placeholder = 'bg-gray-200 dark:bg-gray-800',
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const paddingBottom = aspectRatio
    ? `${(100 * parseFloat(aspectRatio.split('/')[1])) / parseFloat(aspectRatio.split('/')[0])}%`
    : undefined

  return (
    <div
      ref={imgRef}
      className={cn('relative overflow-hidden', wrapperClassName)}
      style={paddingBottom ? { paddingBottom } : undefined}
    >
      {/* Placeholder */}
      {!loaded && <div className={cn('absolute inset-0', placeholder)} />}

      {/* Actual image — loaded only when in view */}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={cn(
            'transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0',
            className,
          )}
          style={
            aspectRatio
              ? {
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }
              : undefined
          }
        />
      )}
    </div>
  )
}
