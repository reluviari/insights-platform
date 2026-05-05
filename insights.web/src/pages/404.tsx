import Button from "@src/components/common/Button";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Page404() {
  const router = useRouter();

  const handleRedirectClick = () => {
    router.back();
  };

  const errorPage = (
    <Image
      src={"/errorPage.svg"}
      alt="error page image"
      width={854.17}
      height={322.89}
      style={{ margin: "0 auto" }}
      className="dark:invert"
      priority
    />
  );

  return (
    <section className={`flex min-h-screen`}>
      <div className="flex justify-center items-center w-full flex-col bg-[#F5F5F5] gap-2">
        {errorPage}
        <h1 className="h-[58px] text-neutral-900 text-5xl font-bold not-italic text-center tracking-wide">
          Oops... Página não encontrada!
        </h1>
        <p className="w-[375px] h-[44px] text-neutral-900 text-base font-normal not-italic text-center">
          Parece que a página que você tentou acessar não existe!
        </p>
        <div className="mt-4">
          <Button onClick={handleRedirectClick} size="medium" variant="primary">
            Voltar para página inicial
          </Button>
        </div>
      </div>
    </section>
  );
}
