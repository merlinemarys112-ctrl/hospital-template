import type { CollectionConfig } from 'payload'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', 'author'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-friendly slug for the blog post' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'Short summary or excerpt' },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: { description: 'Blog post content' },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Featured image for the blog post' },
    },
    {
      name: 'author',
      type: 'text',
      admin: { description: 'Author name' },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: { description: 'Publication date' },
    },
    {
      name: 'category',
      type: 'text',
      admin: { description: 'Blog category' },
    },
    {
      name: 'tags',
      type: 'text',
      admin: { description: 'Tags (comma-separated)' },
    },
  ],
}
