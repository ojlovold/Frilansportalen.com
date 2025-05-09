import React from "react";

interface SuggestionBoxProps {
  suggestion: string;
  onAccept: () => void;
  onDismiss?: () => void;
}

export default function SuggestionBox({ suggestion, onAccept, onDismiss }: SuggestionBoxProps) {
  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative my-4">
      <strong className="font-bold">Vi foreslår dette: </strong>
      <p className="my-2">{suggestion}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={onAccept} className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
          Bruk forslag
        </button>
        {onDismiss && (
          <button onClick={onDismiss} className="bg-white border border-black px-3 py-1 rounded hover:bg-gray-100">
            Ignorer
          </button>
        )}
      </div>
    </div>
  );
}
