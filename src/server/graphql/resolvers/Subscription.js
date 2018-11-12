import { withFilter } from 'apollo-server';
import * as Types from '../types';
import pubSub from './pubSub';
// import ObjectNode from '../../models/object';
// import Searchable from '../../models/searchable';

const Subscription = {
  fileConversionProgress: {
    subscribe: withFilter(
      () => pubSub.asyncIterator([Types.FILE_UPLOAD_PROGRESS]),
      (payload, variables) => {
        return payload.uploadToken === variables.uploadToken;
      }
    )
  }
};

export default Subscription;
