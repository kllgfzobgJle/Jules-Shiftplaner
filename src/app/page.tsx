"use client";

import { useAppData } from "@/components/DataProvider";

export default function Home() {
  const { employees, addEmployee, loading } = useAppData();

  const handleAddDummyEmployee = () => {
    const dummyEmployee = {
      firstName: "Max",
      lastName: `Mustermann ${employees.length + 1}`,
      employeeType: "regular" as const,
      employmentPercentage: 100,
      teamId: "team-1", // Assuming a team exists for this test
      qualifications: {},
      availability: {},
    };
    addEmployee(dummyEmployee);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="p-4 border rounded-md bg-white">
        <h2 className="text-xl font-semibold mb-2">Mitarbeiterliste</h2>
        {employees.length > 0 ? (
          <ul>
            {employees.map((emp) => (
              <li key={emp.id} className="p-2 border-b">
                {emp.firstName} {emp.lastName} (ID: {emp.id})
              </li>
            ))}
          </ul>
        ) : (
          <p>Noch keine Mitarbeiter angelegt.</p>
        )}
        <button
          onClick={handleAddDummyEmployee}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Dummy Mitarbeiter hinzufügen
        </button>
      </div>
    </div>
  );
}
