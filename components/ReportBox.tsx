import React, { useState } from "react";

export default function ReportBox() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send feilmelding til backend / e-post
    console.log("Feil sendt:", message);
    setSubmitted(true);
    setMessage("");
  };

  return (
    <div className="bg-orange-100 border border-orange-400 text-orange-900 px-4 py-3 rounded my-4">
      {submitted ? (
        <p>Takk for tilbakemeldingen!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Meld en feil:</label>
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Hva gikk galt?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit" className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
            Send inn
          </button>
        </form>
      )}
    </div>
  );
}
