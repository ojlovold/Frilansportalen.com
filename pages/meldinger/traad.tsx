<form onSubmit={send} className="grid gap-3 max-w-lg">
  <textarea
    required
    placeholder="Skriv svar..."
    value={innhold}
    onChange={(e) => setInnhold(e.target.value)}
    className="p-2 border rounded h-28 resize-none"
  ></textarea>

  <div className="flex gap-2">
    <button
      type="submit"
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
    >
      Send svar
    </button>

    <button
      type="button"
      className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 text-sm"
      onClick={() =>
        setInnhold(
          "Hei! Takk for meldingen. Dette høres interessant ut. Jeg kan gjerne ta en prat nærmere."
        )
      }
    >
      Foreslå tekst
    </button>
  </div>
</form>
