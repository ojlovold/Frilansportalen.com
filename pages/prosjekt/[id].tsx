// ... importlinjer øverst
import ProsjektEtiketter from "@/components/prosjekt/ProsjektEtiketter";

// inne i <Dashboard>
<Dashboard>
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">{prosjekt.navn}</h1>
    <p className="text-sm text-gray-700">{prosjekt.beskrivelse}</p>
    <p>Status: <strong>{prosjekt.status}</strong></p>
    <p>Frist: {new Date(prosjekt.frist).toLocaleDateString()}</p>

    <div>
      <h2 className="text-lg font-bold">Deltakere</h2>
      <ul className="list-disc ml-5 text-black">
        {deltakere.map((d) => (
          <li key={d.id}>
            {d.bruker?.navn || d.bruker_id} ({d.rolle})
          </li>
        ))}
      </ul>
    </div>

    {/* NYTT: Etikettkontroll */}
    <ProsjektEtiketter prosjektId={prosjekt.id} />

    {/* Resten som før */}
    <NyOppgave prosjektId={prosjekt.id} />
    <OppgaveListe prosjektId={prosjekt.id} />
    <LastOppProsjektfil prosjektId={prosjekt.id} />
    <ProsjektChat prosjektId={prosjekt.id} />
    <ProsjektKalender prosjektId={prosjekt.id} />
    <ProsjektNotat prosjektId={prosjekt.id} />
    <ProsjektAI prosjektId={prosjekt.id} />
    <EksporterProsjekt prosjektId={prosjekt.id} />
    <ArkiverProsjekt prosjektId={prosjekt.id} />

    {prosjekt.videorom_id && (
      <ProsjektVideo romId={prosjekt.videorom_id} />
    )}
  </div>
</Dashboard>
