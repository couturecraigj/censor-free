import mongoose from 'mongoose';

export default async (results, nodeField = 'node', search) => {
  if (!results) return [];
  const postNodeMap = await Promise.all(
    Object.entries(
      results.reduce((p, c) => {
        return {
          ...p,
          [c.kind]: p[c.kind] ? [...p[c.kind], c[nodeField]] : [c[nodeField]]
        };
      }, {})
    ).map(([key, value]) => {
      return Promise.all([
        key,
        mongoose.models[key]
          .find(
            {
              _id: { $in: value },
              $text: { $search: search }
            },
            {
              textMatchScore: { $meta: 'textScore' }
            }
          )
          .sort({ textMatchScore: { $meta: 'textScore' } })
      ]);
    })
  ).then(result => {
    return result.reduce((p, [key, value]) => ({ ...p, [key]: value }), {});
  });
  const final = results
    .map(result => {
      const obj = postNodeMap[result.kind].find(
        v => v?.id === result[nodeField].toString()
      );
      if (obj) obj.kind = result.kind;
      return obj;
    })
    .filter(v => v);
  final.sort((a, b) => b.textMatchScore - a.textMatchScore);
  return final;
};
