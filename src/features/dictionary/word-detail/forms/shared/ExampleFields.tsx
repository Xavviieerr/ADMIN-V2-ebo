import { AudioInput } from "@/features/shared";

export type ExampleValue = {
  sentence: string;
  audioUrl: string;
};

const ExampleFields = ({
  title,
  idje,
  onChange,
}: {
  title: string;
  idje: ExampleValue[];
  onChange: (idje: ExampleValue[]) => void;
}) => {
  return (
    <div className="flex flex-col  md:col-span-2 gap-4">
      <h2>{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {idje.map((example, index) => (
          <div key={index} className="flex flex-col w-full">
            <div className="flex items-center gap-4 w-full">
              <AudioInput
                placeholder={`Example ${index + 1}`}
                input={example.sentence}
                audioUrl={example.audioUrl}
                showDelete={idje.length > 1}
                setValue={(value) =>
                  onChange(
                    idje.map((ex, i) =>
                      i === index ? { ...ex, sentence: value } : ex,
                    ),
                  )
                }
                setAudio={(value) =>
                  onChange(
                    idje.map((ex, i) =>
                      i === index ? { ...ex, audioUrl: value } : ex,
                    ),
                  )
                }
                handleDelete={() => {
                  onChange(idje.filter((_, i) => i !== index));
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          onChange([...idje, { sentence: "", audioUrl: "" }]);
        }}
        className="secondary-btn px-10"
      >
        Add another example
      </button>
    </div>
  );
};

export default ExampleFields;
