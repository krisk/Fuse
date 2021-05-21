export class IncorrectIndexTypeException extends Error {
  constructor(message = "Incorrect 'index' type") {
    super(message);
    this.name = "IncorrectIndexTypeException";
  }
}

export class LogicalSearchUnavailableException extends Error {
  constructor(message = "Logical search is not available") {
    super(message);
    this.name = "LogicalSearchUnavailableException";
  }
}

export class ExtendedSearchUnavailableException extends Error {
  constructor(message = "Extended search is not available") {
    super(message);
    this.name = "ExtendedSearchUnavailableException";
  }
}

export class MissingKeyPropertyException extends Error {
  constructor(name) {
    super(`Missing ${name} property in key`);
    this.name = "MissingKeyPropertyException";
  }
}

export class PatternLengthTooLargeException extends Error {
  constructor(max) {
    super(`Pattern length exceeds max of ${max}`);
    this.name = "PatternLengthTooLargeException";
  }
}

export class InvalidKeyWeightValueException extends Error {
  constructor(key) {
    super(`Property 'weight' in key '${key}' must be a positive integer`);
    this.name = "InvalidKeyWeightValueException";
  }
}

export class LogicalSearchInvalidQueryForKeyException extends Error {
  constructor(key) {
    super(`Invalid value for key ${key}`);
    this.name = "LogicalSearchInvalidQueryForKeyException";
  }
}
