/**
 * Represents a folder within a collection.
 */
export type Folder = {
  /** The unique identifier of the folder. */
  id: string;
  /** The name of the folder. */
  name: string;
  /** The ID of the collection this folder belongs to. */
  collection_id: string;
  /** The position of the folder in the collection (used for ordering). */
  position: number;
};