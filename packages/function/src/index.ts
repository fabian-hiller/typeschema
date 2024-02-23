/**
 * This file is generated. Do not modify it manually!
 */

import type {
  InputFrom,
  OutputFrom,
  SchemaFrom,
  UnknownIfNever,
} from '@typeschema/core';

import {
  createAssert,
  createValidate,
  createWrap,
} from '@typeschema/core';

import {AdapterResolver} from './resolver';
import {validationAdapter} from './validation';

export type Schema = SchemaFrom<AdapterResolver>;
export type Infer<TSchema extends Schema> = UnknownIfNever<
  OutputFrom<AdapterResolver, TSchema>
>;
export type InferIn<TSchema extends Schema> = UnknownIfNever<
  InputFrom<AdapterResolver, TSchema>
>;

export const validate = createValidate(validationAdapter);
export const assert = createAssert(validate);
export const wrap = createWrap(assert, validate);


export {
  AdapterResolver,
  validationAdapter,
};
