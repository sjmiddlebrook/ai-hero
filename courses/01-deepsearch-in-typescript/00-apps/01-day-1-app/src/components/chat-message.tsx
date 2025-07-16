import ReactMarkdown, { type Components } from "react-markdown";
import type { Message } from "ai";

export type MessagePart = NonNullable<Message["parts"]>[number];

interface ChatMessageProps {
  parts: MessagePart[] | undefined;
  role: string;
  userName: string;
}

const components: Components = {
  // Override default elements with custom styling
  p: ({ children }) => <p className="mb-4 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal pl-4">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  code: ({ className, children, ...props }) => (
    <code className={`${className ?? ""}`} {...props}>
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-700 p-4">
      {children}
    </pre>
  ),
  a: ({ children, ...props }) => (
    <a
      className="text-blue-400 underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
};

const Markdown = ({ children }: { children: string }) => {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
};

const renderToolInvocation = (toolInvocation: MessagePart & { type: "tool-invocation" }) => {
  const { toolInvocation: tool } = toolInvocation;

  if (tool.state === "partial-call") {
    return (
      <div className="mb-4 rounded-lg bg-gray-700 p-3">
        <div className="flex items-center gap-2">
          <div className="size-2 animate-pulse rounded-full bg-blue-400"></div>
          <span className="text-sm font-medium text-blue-400">
            Calling {tool.toolName}...
          </span>
        </div>
      </div>
    );
  }

  if (tool.state === "call") {
    return (
      <div className="mb-4 rounded-lg bg-gray-700 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-2 rounded-full bg-yellow-400"></div>
          <span className="text-sm font-medium text-yellow-400">
            {tool.toolName}
          </span>
        </div>
        <div className="text-sm text-gray-400">
          <strong>Query:</strong> {tool.args.query}
        </div>
      </div>
    );
  }

  if (tool.state === "result") {
    return (
      <div className="mb-4 rounded-lg bg-gray-700 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-2 rounded-full bg-green-400"></div>
          <span className="text-sm font-medium text-green-400">
            {tool.toolName}
          </span>
        </div>
        <div className="text-sm text-gray-400 mb-2">
          <strong>Query:</strong> {tool.args.query}
        </div>
        <div className="text-xs text-gray-500">
          <strong>Results:</strong> {Array.isArray(tool.result) ? tool.result.length : 1} results found
        </div>
      </div>
    );
  }

  return null;
};

export const ChatMessage = ({ parts, role, userName }: ChatMessageProps) => {
  const isAI = role === "assistant";

  return (
    <div className="mb-6">
      <div
        className={`rounded-lg p-4 ${
          isAI ? "bg-gray-800 text-gray-300" : "bg-gray-900 text-gray-300"
        }`}
      >
        <p className="mb-2 text-sm font-semibold text-gray-400">
          {isAI ? "AI" : userName}
        </p>

        <div className="prose prose-invert max-w-none">
          {parts?.map((part, index) => {
            if (part.type === "text") {
              return <Markdown key={index}>{part.text}</Markdown>;
            }

            if (part.type === "tool-invocation") {
              return (
                <div key={index}>
                  {renderToolInvocation(part)}
                </div>
              );
            }

            // Handle other part types as needed
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
