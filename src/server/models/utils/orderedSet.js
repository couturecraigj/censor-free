import mongoose from 'mongoose';

export default async (results, nodeField = 'node') => {
  // console.log(results);
  if (!results) return [];
  const postNodeMap = await results.reduce(async (p, c) => {
    // console.log(mongoose.models[c.kind].findById(c.post));
    return {
      ...p,
      [c.kind]: p[c.kind]
        ? [...p[c.kind], await mongoose.models[c.kind].findById(c[nodeField])]
        : [await mongoose.models[c.kind].findById(c[nodeField])]
    };
  }, {});
  // console.log(postNodeMap);
  const final = results
    .map(result => {
      const obj = postNodeMap[result.kind].find(
        v => v?.id === result[nodeField].toString()
      );
      if (obj) obj.kind = result.kind;
      return obj;
    })
    .filter(v => v);
  return final;
};
