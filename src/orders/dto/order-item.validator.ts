import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'inventoryOrService', async: false })
export class InventoryOrServiceValidator implements ValidatorConstraintInterface {
  validate(_: unknown, args?: ValidationArguments) {
    const { inventoryId, serviceId } = args?.object as {
      inventoryId?: string;
      serviceId?: string;
    };
    return !!inventoryId !== !!serviceId;
  }

  defaultMessage() {
    return 'Either inventoryId or serviceId must be provided (not both)';
  }
}
