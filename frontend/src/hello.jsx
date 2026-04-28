import React from 'react';

const students = [
  { id: 1, name: 'Alice', passed: true },
  { id: 2, name: 'Bob', passed: false },
  { id: 3, name: 'Charlie', passed: true },
  { id: 4, name: 'David', passed: false }
];

export default function hello() {
  return (
    <div>
      <h2>Passing Students</h2>
      
      <ul>
        {students
          .filter(student => student.passed) 
          
          .map(student => (
            <li key={student.id}>
              {student.name}
            </li>
          ))}
      </ul>
    </div>
  );
}
