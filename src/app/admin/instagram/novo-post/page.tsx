import { InstagramSubnav } from "@/components/admin/InstagramSubnav";
import { NovoPostClient } from "./NovoPostClient";
import { MOCK_PRODUCTS } from "@/lib/mock/products";

export const metadata = { title: "Novo post · Instagram" };

export default function NovoPostPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-display-lg text-ink-deep">Novo post</h1>
        <p className="mt-1 text-sm text-stone-300">
          Fluxo de criação assistido por IA
        </p>
      </div>
      <InstagramSubnav atual="/admin/instagram/novo-post" />
      <NovoPostClient produtos={MOCK_PRODUCTS} />
    </div>
  );
}
