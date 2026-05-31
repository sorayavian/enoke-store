import { InstagramSubnav } from "@/components/admin/InstagramSubnav";
import { ScannerClient } from "./ScannerClient";

export const metadata = { title: "Scanner · Instagram" };

export default function ScannerPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-display-lg text-ink-deep">
          Scanner de óculos
        </h1>
        <p className="mt-1 text-sm text-stone-300">
          Foto → código detectado → produto criado → posts gerados
        </p>
      </div>
      <InstagramSubnav atual="/admin/instagram/scanner" />
      <ScannerClient />
    </div>
  );
}
