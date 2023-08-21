export const wistiaMedia = {
  name: 'wistiaMedia',
  type: 'object',
  title: 'Wistia media',
  fields: [
    {
      type: 'number',
      name: 'id',
    },
    {
      type: 'string',
      name: 'hashed_id',
    },
  ],
  preview: {
    select: {
      title: 'id',
    },
     prepare({ title }: { title: String }) {
      return {
        title: `Wistia video ID: ${title}`
      }
    }
  }
}