import React, { useEffect, useRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import CodeBlock from "./codeblock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "../ui/table";

// --- Common styles ---
const listClasses = "list-outside ml-4";
const headingBase = "font-semibold mt-6 mb-2";

// --- Markdown element overrides ---
const components: Partial<Components> = {
  code({ className, children, ...props }) {
    const text = String(children).replace(/\n$/, "");
    const match = /language-(\w+)/.exec(className || "");

    // Inline code
    if (!text.includes("\n")) {
      return (
        <code
          className={cn(className, "px-1 py-0.5 rounded bg-muted")}
          {...props}
        >
          {text}
        </code>
      );
    }

    // Code block
    return (
      <div className="relative my-4 max-h-[500px] overflow-auto rounded-lg border border-border bg-neutral-950">
        <CodeBlock language={match?.[1] || ""} value={text} {...props} />
      </div>
    );
  },
  pre: ({ children }) => <>{children}</>,
  ol: ({ children, ...props }) => (
    <ol className={cn("list-decimal", listClasses)} {...props}>
      {children}
    </ol>
  ),
  ul: ({ children, ...props }) => (
    <ul className={cn("list-disc", listClasses)} {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }) => (
    <li className="py-1" {...props}>
      {children}
    </li>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-border pl-4 py-1 my-4 bg-muted/20 rounded-r-lg italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <Link
      to={href || ""}
      target="_blank"
      rel="noreferrer"
      className="text-sky-400 hover:underline"
    >
      {children}
    </Link>
  ),
  p: ({ children }) => (
    <p className="leading-relaxed my-2 text-foreground/90">{children}</p>
  ),
  h1: ({ children }) => <h1 className={cn("text-3xl", headingBase)}>{children}</h1>,
  h2: ({ children }) => <h2 className={cn("text-2xl", headingBase)}>{children}</h2>,
  h3: ({ children }) => <h3 className={cn("text-xl", headingBase)}>{children}</h3>,
  h4: ({ children }) => <h4 className={cn("text-lg", headingBase)}>{children}</h4>,
  h5: ({ children }) => <h5 className={cn("text-base", headingBase)}>{children}</h5>,
  h6: ({ children }) => <h6 className={cn("text-sm", headingBase)}>{children}</h6>,
  table: ({ children }) => (
    <div className="my-6 rounded-md border border-border overflow-x-auto">
      <Table>{children}</Table>
    </div>
  ),
  thead: ({ children }) => <TableHeader>{children}</TableHeader>,
  tbody: ({ children }) => <TableBody>{children}</TableBody>,
  tr: ({ children }) => <TableRow>{children}</TableRow>,
  td: ({ children }) => (
    <TableCell className="p-3 border-t border-border align-top">{children}</TableCell>
  ),
  th: ({ children }) => (
    <TableHead className="p-3 text-foreground font-medium bg-muted/50">
      {children}
    </TableHead>
  ),
};

const remarkPlugins = [remarkGfm];

const Markdown = ({ children }: { children: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // auto-scroll when chunk updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className="prose prose-neutral dark:prose-invert w-full max-w-none leading-relaxed text-sm sm:text-base"
    >
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
