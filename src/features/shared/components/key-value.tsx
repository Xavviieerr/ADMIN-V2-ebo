const KeyValueParagraph = ({
  item,
  value,
  col,
  isDense,
}: {
  item: string;
  value: string | number;
  col?: boolean;
  isDense?: boolean;
}) => {
  return (
    <p
      className={`${col ? "flex-col" : "gap-2"} flex flex-wrap max-md:text-sm ${isDense ? "text-sm" : ""}`}
    >
      <span className="shrink-0">{item}:</span>{" "}
      <span className="text-gray-txt-50 break-words min-w-0">{value}</span>
    </p>
  );
};

export default KeyValueParagraph;
