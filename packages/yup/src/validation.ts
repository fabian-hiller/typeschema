import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  try {
    const moduleName = 'yup';
    const {ValidationError} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('yup');
    return {ValidationError};
  } catch (error) {
    throw error;
  }
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {ValidationError} = await importValidationModule();
  return async data => {
    try {
      return {
        data: await schema.validate(data, {strict: true}),
        success: true,
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        const {message, path} = error;
        return {
          issues: [
            {
              message,
              path: path != null && path !== '' ? [path] : undefined,
            },
          ],
          success: false,
        };
      }
      throw error;
    }
  };
};