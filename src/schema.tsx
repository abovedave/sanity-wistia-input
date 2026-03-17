export const wistiaMedia = {
  name: 'wistiaMedia',
  type: 'object',
  title: 'Wistia media',
  fields: [
    {
      type: 'number',
      name: 'id',
      hidden: true,
    },
    {
      type: 'string',
      name: 'hashed_id',
      hidden: true,
    },
    {
      type: 'string',
      name: 'title',
      title: 'Title',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'hashed_id',
    },
    prepare({title, subtitle}: {title: string; subtitle: string}) {
      return {
        title: title || 'Wistia video',
        subtitle,
      }
    },
  }
}