import {getDataBaseContents} from "./action";

export default async function DataBaseViewerPage() {
  let data = {};
  try {
    data = await getDataBaseContents();
  } catch (error) {
    console.error("Error fetching database contents:", error);
  }
  return (
    <div className="p-6 space-y-10 mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Database Contents</h1>
      {Object.entries(data).map(([tableName, rows]) => (
        <div key={tableName}>
          <h2>{tableName}</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(rows[0] || {}).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
