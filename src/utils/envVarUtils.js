export function getEnvVarBooleanValue(envVarName) {
  const envVarValue = process.env[envVarName]?.toLowerCase().trim();
  if (!envVarValue) return undefined;

  if (envVarValue === 'true') return true;
  else if (envVarValue === 'false') return false;

  throw new Error(
    `Environment variable '${envVarName}' with value '${envVarValue}' does not match expected 'true' / 'false' string literals.`
  );
}
