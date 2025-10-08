/**
 * Represents a collection of items.
 *
 * @typedef {Object} Collection
 * @property {string} id - The unique identifier for the collection.
 * @property {string} name - The name of the collection.
 * @property {string | null} description - A brief description of the collection, or `null` if none is provided.
 */
export type Collection = {
  id: string;
  name: string;
  description: string | null;
};
