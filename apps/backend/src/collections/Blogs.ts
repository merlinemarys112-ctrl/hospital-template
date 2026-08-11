import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '../access/patterns'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', 'author'],
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'URL-friendly slug for the blog post' },
    },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText', required: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'author', type: 'text' },
    { name: 'publishedDate', type: 'date' },
    { name: 'category', type: 'text' },
    { name: 'tags', type: 'text', admin: { description: 'Tags (comma-separated)' } },
  ],
}
