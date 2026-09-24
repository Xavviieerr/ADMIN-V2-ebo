import { formatSenses } from "@/features/dictionary/lib/add-word/format-word-payload";
import { useAddWordWizard } from "../contexts/AddWordWizardContext";
import { useWizardStep } from "@/features/dictionary/hooks/useWizardStep";

export function useSensesSubmit() {
  const { data, setData, senses } = useAddWordWizard();
  const { goStep } = useWizardStep();

  const handleSubmit = () => {
    const oho = senses.map((sense, index) => {
      return formatSenses({
        image: data.image,
        index: index + 1,
        urh: sense.urhData,
        eng: sense.engData,
        kor: sense.korData,
      });
    });
    setData((prev) => ({ ...prev, oho }));

    goStep("preview");
  };

  return { handleSubmit };
}
