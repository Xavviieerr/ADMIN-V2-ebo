export const formatCamelCase = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, "$1 $2");
