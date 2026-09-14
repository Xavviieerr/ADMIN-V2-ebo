import React from "react";
import { Controller, useFieldArray, useFormState } from "react-hook-form";
import { FormControl, FormItem } from "../form";
import { X, Plus } from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";

export function OkpoFieldArray({
    control,
    name,
    label,
    lang,
  }: {
    control: any;
    name: string;
    label: string;
    lang?:string
  }) {
    const { fields, append, remove } = useFieldArray({ control, name });
    const { errors } = useFormState({ control });
    
    // Get error for the array field (nested path like "oho.0.okpo")
    const getFieldError = (fieldPath: string) => {
      const pathParts = fieldPath.split('.');
      let error: any = errors;
      for (const part of pathParts) {
        if (error && typeof error === 'object' && part in error) {
          error = error[part];
        } else {
          return null;
        }
      }
      return error;
    };
    
    const fieldError = getFieldError(name);
    
    // Ensure at least one field exists
    React.useEffect(() => {
      if (fields.length === 0) {
        append({ ota: "", egba: "" });
      }
    }, [fields.length, append]);
  
    return (
      <div className="mt-4">
        <div className="space-y-4 mt-2">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row items-start gap-5 border p-3  rounded-md bg-[#1e1e1e]"
            >
              {/* Related word (ota) */}
              <Controller
                control={control}
                name={`${name}.${idx}.ota`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl className="mt-2">
                      <Input {...field} placeholder="Okpo" />
                    </FormControl>
                  </FormItem>
                )}
              />
  
              {/* Egba select */}
              <Controller
                control={control}
                name={`${name}.${idx}.egba`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="mt-2">
                      <select
                        {...field}
                        className="h-9 rounded-md border bg-[#1e1e1e] px-2 text-sm text-white"
                      >
                        <option value="" className="text-white">Strength</option>
                        <option value={lang === "eng" ? `strong` : lang === "kor" ? `strong` : `gan` } className="text-white">{lang === "eng" ? "Strong" : lang === "kor" ? '강' : "Gan"}</option>
                        <option value={lang === "eng" ? `Not strong` : lang === "kor" ? `Not strong` : `guo` } className="text-white">{lang === "eng" ? "Not Strong" : lang === "kor" ? '약' : "Guo"}</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
  
              {/* Remove button */}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-red-400 hover:text-red-600 mt-6"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        {/* Add button */}
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => append({ ota: "", egba: "" })}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Related Word
          </Button>
        </div>
      </div>
    );
  }
  