import { SchemaDirectiveVisitor } from 'apollo-server';
import { defaultFieldResolver } from 'graphql';

class FieldIndexDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    // THIS INDEX FIELD IS ONLY TO SIGNIFY THINGS TO THE CLIENT
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async function(...args) {
      const result = await resolve.apply(this, args);

      return result;
    };
  }
}
class FieldUniqueDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    // THIS INDEX FIELD IS ONLY TO SIGNIFY THINGS TO THE CLIENT
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async function(...args) {
      const result = await resolve.apply(this, args);

      return result;
    };
  }
}
class FieldLowerCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    // THIS INDEX FIELD IS ONLY TO SIGNIFY THINGS TO THE CLIENT
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async function(...args) {
      const result = await resolve.apply(this, args);

      if (typeof result === 'string') {
        return result.toLowerCase();
      }

      return result;
    };
  }
}

export default {
  index: FieldIndexDirective,
  unique: FieldUniqueDirective,
  lowerCase: FieldLowerCaseDirective
};
