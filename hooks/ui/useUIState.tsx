import { useState } from "react";

export const useUIState = () => {
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(
    new Set(),
  );
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
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
