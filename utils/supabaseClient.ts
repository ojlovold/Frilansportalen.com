import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tvnwbchnvnhehuzrzqfq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bndiY2hudm5oZWh1enJ6cWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTU3ODQsImV4cCI6MjA2MjM3MTc4NH0.jkjwXAglHkSeOmCDdvAIq_cJnqjn-kkrvEWLWLEn8as"
);

export { supabase };
