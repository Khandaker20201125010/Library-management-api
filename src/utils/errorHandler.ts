export const handleError = (res: any,statusCode: number,message: string,error: any) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: formatError(error),
  });
};

const formatError = (error: any) => {
  if (error?.name === "ZodError" || error instanceof Error && "errors" in error) {
    return {
      name: "ValidationError",
      errors: error.flatten ? error.flatten().fieldErrors : error.errors,
    };
  }
  if (error?.name === "ValidationError") {
    return {
      name: error.name,
      errors: error.errors,
    };
  }

  return typeof error === "object" ? error : { message: error };
};
