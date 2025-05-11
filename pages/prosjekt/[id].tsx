...

        <EksporterProsjekt prosjektId={prosjekt.id} />
        <EksporterProsjektlogg prosjektId={prosjekt.id} />
        <ArkiverProsjekt prosjektId={prosjekt.id} />

        {prosjekt.videorom_id && (
          <ProsjektVideo romId={prosjekt.videorom_id} />
        )}
...
