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
      className={`${col ? "flex-col" : "gap-2"} flex max-md:text-sm ${isDense ? "text-sm" : ""}`}
    >
      <span>{item}:</span> <span className="text-gray-txt-50">{value}</span>
    </p>
  );
};

export default KeyValueParagraph;
