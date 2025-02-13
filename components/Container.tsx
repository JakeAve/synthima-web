import { JSX } from "preact";

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
  bgColor: string;
}

export function Container(props: Props) {
  return (
    <section class={props.bgColor}>
      <div {...props} class={`max-w-2xl mx-auto px-4 py-8 ${props.class}`}>
        {props.children}
      </div>
    </section>
  );
}
