const uuidRegex = new RegExp(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
);

/**
 * Checks to make sure the UUID is either null or a valid v4 UUID.
 * @param uuid The v4 UUID to compare against.
 * @returns Whether the provided UUID is either null or a valid v4 UUID.
 */
export const validateUuid = (uuid: string) => {
  if (uuid === null) return true;
  else return typeof uuid === "string" ? uuidRegex.test(uuid) : false;
};
