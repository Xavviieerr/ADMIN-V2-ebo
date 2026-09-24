import { BaseInput, BaseTextArea } from "@/features/shared";

export type MetaValues = {
  ekerota: string[];
  upho: string;
  uphoesio: string;
  odeUfue: string[];
  oto: string;
};

const FormMetaFields = ({
  values,
  onChange,
  posOptions,
}: {
  values: MetaValues;
  onChange: (patch: Partial<MetaValues>) => void;
  posOptions: string[];
}) => {
  return (
    <>
      <select
        value={values.ekerota[0]}
        onChange={(e) => onChange({ ekerota: [e.target.value] })}
        id="pos"
        className="input h-12 capitalize bg-secondary-bg"
      >
        {posOptions.map((pos) => (
          <option
            key={pos}
            value={pos}
            className="text-white bg-secondary-bg capitalize"
          >
            {pos}
          </option>
        ))}
      </select>

      <BaseInput
        placeholder="Pronunciation"
        value={values.upho}
        setValue={(value) => onChange({ upho: value as string })}
      />

      <BaseInput
        placeholder="IPA"
        value={values.uphoesio}
        setValue={(value) => onChange({ uphoesio: value as string })}
      />

      <BaseInput
        placeholder="Scientific Name"
        value={values.odeUfue[0]}
        setValue={(value) => onChange({ odeUfue: [value as string] })}
      />

      <BaseTextArea
        placeholder="Meaning of the word"
        rows={3}
        value={values.oto}
        setValue={(value) => onChange({ oto: value })}
        styling="md:col-span-2"
      />
    </>
  );
};

export default FormMetaFields;
