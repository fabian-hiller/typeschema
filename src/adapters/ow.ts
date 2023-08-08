import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type {Infer, Predicate} from 'ow';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils';
import {ValidationIssue} from '../validation';

export interface OwResolver extends Resolver {
  base: Predicate<this['type']>;
  input: this['schema'] extends Predicate ? Infer<this['schema']> : never;
  output: this['schema'] extends Predicate ? Infer<this['schema']> : never;
}

const fetchModule = memoize(async () => {
  const {ArgumentError, default: ow} = await import('ow');
  return {ArgumentError, ow};
});

const coerce: Coerce<'ow'> = fn => async schema =>
  'context' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(async schema => {
  const {ow, ArgumentError} = await fetchModule();
  const assertSchema = ow.create(schema);
  return async data => {
    try {
      assertSchema(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {data: data as any};
    } catch (error) {
      if (error instanceof ArgumentError) {
        return {
          issues: Array.from(error.validationErrors.values()).flatMap(
            messages =>
              Array.from(messages).map(message => new ValidationIssue(message)),
          ),
        };
      }
      throw error;
    }
  };
});