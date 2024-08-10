import { PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { JoiValidationException } from 'unified-errors-handler';

export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(originalValue: unknown) {
    const { error, value } = this.schema.validate(originalValue);
    if (error) {
      throw new JoiValidationException(error);
    }
    return value;
  }
}
