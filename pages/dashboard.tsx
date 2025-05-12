// pages/dashboard.tsx
import Head from 'next/head'
import Dashboard from '../components/Dashboard'
import NotificationBell from '../components/NotificationBell'
import SendFaktura from '../components/SendFaktura'
import MineDokumenter from '../components/MineDokumenter'
import MineRapporter from '../components/MineRapporter'

export default function DashboardSide() {
  return (
    <>
      <Head>
        <title>Dashbord | Frilansportalen</title>
        <meta name="description" content="Ditt personlige dashbord" />
      </Head>
      <Dashboard>
        {/* Varsler */}
        <div className="flex justify-end mb-6">
          <NotificationBell />
        </div>

        {/* Hovedinnhold */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SendFaktura />
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Velkommen!</h2>
            <p>
              Her kan du sende fakturaer, se meldinger, dokumenter, rapporter og kart. Flere moduler kommer.
            </p>
          </div>
        </div>

        {/* Dokumenter og rapporter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <MineDokumenter />
          <MineRapporter />
        </div>
      </Dashboard>
    </>
  )
}
