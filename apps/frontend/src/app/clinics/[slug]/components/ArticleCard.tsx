import type { Article } from '@/types/cms'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { mediaAlt, mediaSrc } from './media'

type Props = {
  article: Article
  clinicName: string
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return value
  }
}

export function ArticleCard({ article, clinicName }: Props) {
  const coverSrc = mediaSrc(article.coverImage, 'medium') || mediaSrc(article.coverImage)

  return (
    <article className="flex h-full flex-col border-b border-brand-line pb-6">
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-mist">
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt={mediaAlt(article.coverImage, article.title)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
      </div>

      <p className="mt-4 font-clinic-mono text-[11px] uppercase tracking-[0.16em] text-brand-teal">
        By {clinicName}
      </p>
      <time
        dateTime={article.publishedDate}
        className="mt-1 text-xs text-brand-ink-soft"
      >
        {formatDate(article.publishedDate)}
      </time>

      <h3 className="mt-3 font-serif text-xl leading-snug tracking-tight text-brand-ink">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-brand-ink-soft">
        {article.excerpt}
      </p>

      <Link
        href={`/articles/${article.slug}`}
        className="mt-4 inline-flex text-sm font-medium text-brand-copper underline-offset-4 hover:underline"
      >
        Read More
      </Link>
    </article>
  )
}
