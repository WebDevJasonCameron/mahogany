/**
 * isValidId
 *
 * Determines whether a value is a valid Mahogany domain object identity.
 *
 * Mahogany uses UUID v4 identifiers as stable, opaque identities for domain
 * objects. This validator provides the shared identity rule used when an
 * existing ID is supplied or referenced rather than newly generated.
 *
 * Identity validation is intentionally independent of Components,
 * Component Definitions, names, filesystem paths, categories, states, and
 * other domain-specific concerns.
 *
 * This function validates only the format of an ID. It does not determine
 * whether an object with that ID actually exists.
 */

const UUID_V4_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidId(value: string): boolean {
    return UUID_V4_PATTERN.test(value);
}