import mongoose from 'mongoose';

export default async (results, nodeField = 'node', search) => {
  if (!results) return [];

  // console.log(results);
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
          .ensureIndexes()
          .catch(() => {
            // console.error(e);
            // console.log({ type: 'Index', [key]: value });
            return;
          })
          .then(() =>
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
          )
          .catch(e => {
            // eslint-disable-next-line no-console
            console.error(e);
            // eslint-disable-next-line no-console
            console.log({ type: 'Model', [key]: value });

            return;
          })
      ]);
    })
  ).then(result => {
    return result.reduce(
      (p, [key, value]) => (!value ? p : { ...p, [key]: value }),
      {}
    );
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
