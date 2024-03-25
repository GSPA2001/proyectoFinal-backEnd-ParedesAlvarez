class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.origin = "custom";
    this.isCustom = true;
  }
}

export default CustomError;