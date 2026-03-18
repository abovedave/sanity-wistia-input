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
      title: 'title',
      subtitle: 'hashed_id',
    },
    prepare({title, subtitle}: {title: string; subtitle: string}) {
      return {
        title: title || 'Wistia media',
        subtitle,
      }
    },
  },
}
