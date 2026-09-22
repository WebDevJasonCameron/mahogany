/**
 * createId
 *
 * Generates a new stable identity for a Mahogany domain object.
 *
 * Mahogany uses UUID v4 identifiers as opaque, globally unique identities.
 * An ID is generated once when a new domain object is created and must
 * remain unchanged for the lifetime of that object.
 *
 * IDs are intentionally independent of human-readable names, filesystem
 * paths, categories, states, and object content. Renaming, moving, or
 * modifying an object must therefore not cause its ID to change.
 *
 * When an existing object is copied or instantiated, the new object receives
 * its own ID. Relationships to the source object are represented separately,
 * such as through a Component Definition's `copyOf` property.
 *
 * UUID generation uses Node's built-in `crypto.randomUUID()`, which produces
 * RFC 4122 version 4 UUIDs without requiring an external dependency or
 * centralized ID authority.
 */

import { randomUUID } from "node:crypto";

export function createId(): string {
    return randomUUID();
}