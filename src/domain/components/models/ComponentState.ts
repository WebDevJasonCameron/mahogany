/**
 * ComponentState
 *
 * Defines the lifecycle contexts in which Mahogany Components can exist.
 *
 * A Component's state describes the role that particular Component plays
 * within Mahogany's workflow and contributes to determining where the
 * Component is stored within the Component library.
 *
 * - `Library` represents reusable source Components.
 * - `Package` represents Components copied into a prepared world,
 *   campaign, story, or similar collection.
 * - `InPlay` represents Components copied from a Package into an
 *   independent active run or playthrough.
 *
 * State describes the type of context. The specific context is identified
 * separately by the Component's `stateId`.
 */


export enum ComponentState {
    Library = "library",
    Package = "package",
    InPlay = "inPlay",
}