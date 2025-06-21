export const handleError = (
  res: any,
  statusCode: number,
  message: string,
  error?: any
) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: formatError(error),
  });
};

const formatError = (error: any) => {
  if (error?.name === "ZodError" || (error instanceof Error && "flatten" in error)) {
    return {
      name: "ValidationError",
      errors: error.flatten ? error.flatten().fieldErrors : {},
    };
  }
  if (error?.name === "ValidationError" && error.errors) {
    const formatted: Record<string, any> = {};
    for (const key in error.errors) {
      const err = error.errors[key];
      formatted[key] = {
        message: err.message,
        kind: err.kind,
        path: err.path,
        value: err.value,
      };
    }
    return {
      name: error.name,
      errors: formatted,
    };
  }

  return typeof error === "object" && error !== null
    ? error
    : { message: error?.toString() || "An unknown error occurred" };
};
