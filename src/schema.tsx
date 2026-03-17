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
      subtitle: 'hashed_id',
    },
    prepare({title, subtitle}: {title: number; subtitle: string}) {
      return {
        title: `Wistia ID: ${title}`,
        subtitle,
      }
    },
  }
}