

const TableSkeleton = () => {
  return (
    <section className="bg-gray-900 p-6 rounded-lg animate-pulse">
      <div className="h-6 bg-gray-700 rounded mb-4 w-32"></div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-800">
            <tr>
              {[...Array(8)].map((_, idx) => (
                <th key={idx} className="p-2">
                  <div className="h-6 bg-gray-700 rounded w-full"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(2)].map((_, idx) => (
              <tr key={idx} className="bg-gray-800">
                {[...Array(8)].map((_, colIdx) => (
                  <td key={colIdx} className="p-2">
                    <div className="h-6 bg-gray-700 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TableSkeleton