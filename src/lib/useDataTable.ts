/* // lib/useDataTable.ts
import { useState, useEffect, useMemo } from "react";
import { DataItem, generateMockData } from "@/lib/mockData";

export function useDataTable() {
  const [data, setData] = useState<DataItem[]>([]);
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DataItem;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    const mockData = generateMockData();
    setData(mockData);
    setIsLoading(false);
  }, []);

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value != null &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof DataItem) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return {
    paginatedData,
    itemsPerPage,
    currentPage,
    setCurrentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    isLoading,
    requestSort,
  };
}
 */