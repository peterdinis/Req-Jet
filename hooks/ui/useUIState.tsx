import { useState } from "react";

/**
 * Custom hook for managing UI state related to collections, dialogs, and history.
 *
 * Provides state variables and helper functions to control:
 * - Expanded/collapsed collections
 * - Collection dialog visibility
 * - Selected collection
 * - Delete confirmation dialog
 * - Collection to delete
 * - History visibility
 *
 * @returns {object} An object containing state variables and setters.
 * @property {Set<string>} expandedCollections - Set of currently expanded collection IDs.
 * @property {(id: string) => void} toggleCollection - Function to toggle expanded state of a collection by ID.
 * @property {boolean} collectionDialogOpen - Whether the collection dialog is open.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setCollectionDialogOpen - Setter for `collectionDialogOpen`.
 * @property {string | null} selectedCollection - Currently selected collection ID or null.
 * @property {React.Dispatch<React.SetStateAction<string | null>>} setSelectedCollection - Setter for `selectedCollection`.
 * @property {boolean} deleteDialogOpen - Whether the delete confirmation dialog is open.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setDeleteDialogOpen - Setter for `deleteDialogOpen`.
 * @property {string | null} collectionToDelete - ID of the collection to delete, or null.
 * @property {React.Dispatch<React.SetStateAction<string | null>>} setCollectionToDelete - Setter for `collectionToDelete`.
 * @property {boolean} showHistory - Whether the history panel is visible.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setShowHistory - Setter for `showHistory`.
 *
 * @example
 * const {
 *   expandedCollections,
 *   toggleCollection,
 *   collectionDialogOpen,
 *   setCollectionDialogOpen,
 * } = useUIState();
 */
export const useUIState = () => {
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(
    new Set(),
  );
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(
    null,
  );
  const [showHistory, setShowHistory] = useState(false);

  const toggleCollection = (id: string) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedCollections(newExpanded);
  };

  return {
    expandedCollections,
    toggleCollection,
    collectionDialogOpen,
    setCollectionDialogOpen,
    selectedCollection,
    setSelectedCollection,
    deleteDialogOpen,
    setDeleteDialogOpen,
    collectionToDelete,
    setCollectionToDelete,
    showHistory,
    setShowHistory,
  };
};
