import React from "react";

interface ErrorBoxProps {
  message?: string;
}

export default function ErrorBox({ message }: ErrorBoxProps) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
      <strong className="font-bold">Noe gikk galt: </strong>
      <span className="block sm:inline">{message || "Vennligst prøv igjen senere."}</span>
    </div>
  );
}
