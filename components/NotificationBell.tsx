import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // <-- Fikset linje
import { Bell } from 'lucide-react'; // forutsetter at du har lucide-react installert

export default function NotificationBell() {
  const user = useUser();
  const [ulesteVarsler, setUlesteVarsler] = useState(0);

  useEffect(() => {
    if (!user) return;

    const hentVarsler = async () => {
      const { data, error } = await supabase
        .from('varsler')
        .select('id')
        .eq('bruker_id', user.id)
        .eq('lest', false);

      if (!error && data) setUlesteVarsler(data.length);
    };

    hentVarsler();
  }, [user]);

  return (
    <div className="relative">
      <Bell className="w-6 h-6 text-black" />
      {ulesteVarsler > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
          {ulesteVarsler}
        </span>
      )}
    </div>
  );
}
