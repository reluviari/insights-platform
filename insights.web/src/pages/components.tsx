import Button from "@src/components/common/Button";

export default function Components() {
  return (
    <div className="flex justify-center items-center w-screen h-screen flex-col gap-5">
      <div className="flex gap-4">
        <Button size="large" variant="primary">
          Large Primary
        </Button>

        <Button size="medium" variant="primary">
          Medium Primary
        </Button>

        <Button size="small" variant="primary">
          Small Primary Test
        </Button>

        <Button size="x-small" variant="primary">
          XSmall Primary
        </Button>
      </div>
      <div className="flex gap-4">
        <div className="w-[500px]">
          <Button size="large" variant="primary" full>
            Large Primary Full
          </Button>
        </div>
        <Button size="large" variant="primary" disabled>
          Large Primary Disabled
        </Button>
        <Button size="large" variant="primary" isLoading>
          Large Primary Loading
        </Button>
      </div>

      <div className="flex gap-4">
        <Button size="large" variant="secondary">
          Large Secondary
        </Button>

        <Button size="medium" variant="secondary">
          Medium Secondary
        </Button>

        <Button size="small" variant="secondary">
          Small Secondary
        </Button>

        <Button size="x-small" variant="secondary">
          XSmall Secondary
        </Button>
      </div>
      <div className="flex gap-4">
        <div className="w-[500px]">
          <Button size="large" variant="secondary" full>
            Large Secondary Full
          </Button>
        </div>
        <Button size="large" variant="secondary" disabled>
          Large Secondary Disabled
        </Button>
        <Button size="large" variant="secondary" isLoading>
          Large Secondary Loadings
        </Button>
      </div>
    </div>
  );
}
