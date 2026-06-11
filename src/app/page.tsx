import { redirect } from "next/navigation";
import { defaultSiteLocale } from "@/lib/site-config";

export default function RootPage() {
  redirect(`/${defaultSiteLocale}`);
}
