import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { level2CharSet, Requirement } from "@jakeave/synthima";
import { Generator } from "../islands/Generator.tsx";

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const url = new URL(req.url);

    const symbols = url.searchParams.getAll("symbols");
    const mins = url.searchParams.getAll("min");
    const maxes = url.searchParams.getAll("max");

    const requirements: Requirement[] = [];
    symbols.forEach((s, i) => {
      try {
        requirements.push({
          charSet: s,
          min: Number(mins[i]) || 1,
          max: Number(maxes[i]) || undefined,
        });
      } catch {
        // do nothing
      }
    });

    if (!requirements.length) {
      requirements.push(...level2CharSet);
    }

    const length = Number(url.searchParams.get("length")) || 12;

    const resp = await ctx.render({ requirements, length });
    return resp;
  },
};

interface Props {
  requirements: Requirement[];
  length: number;
}

export default function Home(props: PageProps<Props>) {
  const { requirements, length } = props.data;

  return (
    <main class="font-thin text-neutral-700 dark:text-neutral-200">
      <Generator requirements={requirements} length={length} />
    </main>
  );
}
