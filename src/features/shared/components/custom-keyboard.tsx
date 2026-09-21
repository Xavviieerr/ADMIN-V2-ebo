"use client";

import { motion } from "motion/react";
import { GripVertical, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import LocaleWrapper from "../locale-wrapper";
import { useKeyboard } from "./keyboard-context";

const mobileKeys = [..."wertyuiopasdfghjklzcbvọẹnm⌫".split("")];

const ipaVowels = [
  "á",
  "à",
  "ã",
  "é",
  "è",
  "ẽ",
  "ɛ",
  "ɛ́",
  "ɛ̀",
  "ɛ̃",
  "í",
  "ì",
  "ĩ",
  "ó",
  "ò",
  "õ",
  "ɔ",
  "ɔ́",
  "ɔ̀",
  "ɔ̃́",
  "ú",
  "ù",
  "ũ",
  "⌫",
];
const ipaConsonants = [
  "ɣw",
  "ŋm",
  "ŋ͡m",
  "k͡p",
  "ɡ͡b",
  "ɸ",
  "ʃ",
  "ɲ",
  "β",
  "ʄ",
  "ʋ",
  "ɾ",
  "ɾ̣",
  "ɣ",
  "ʒ",
  "⌫",
];

const CustomKeyboard: React.FC<{
  value: string;
  handleChange: (query: string) => void;
  handleEnter?: (query: string) => void;
  onClose: () => void;
}> = ({ handleChange, handleEnter, onClose }) => {
  const [caps, setCaps] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [page, setPage] = useState<"keys" | "ipaV" | "ipaC">("keys");

  const { activeField, showKeyboard } = useKeyboard();

  //   const { t } = useTranslation("common");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const togglePage = () => {
    return page == "keys" ? setPage("ipaV") : setPage("keys");
  };

  const toggleIPA = () => {
    return page == "ipaV" ? setPage("ipaC") : setPage("ipaV");
  };

  const handleOnPress = (key: string) => {
    if (!activeField) return;

    if (key == "enter" && handleEnter) {
      handleEnter(activeField.getValue());
      return;
    }

    const value = activeField.getValue();
    const cursor = activeField.getCursorPos();
    const sortedKey = caps ? key.toUpperCase() : key.toLowerCase();

    let newValue: string;
    let newCursor: number;

    if (key == "enter") {
      newValue = value.slice(0, cursor) + "\n" + value.slice(cursor);
      newCursor = cursor + 1;
    } else if (key == "space") {
      newValue = value.slice(0, cursor) + " " + value.slice(cursor);
      newCursor = cursor + 1;
    } else if (key == "backspace" || key == "⌫") {
      if (cursor === 0) return;
      newValue = value.slice(0, cursor - 1) + value.slice(cursor);
      newCursor = cursor - 1;
    } else {
      newValue = value.slice(0, cursor) + sortedKey + value.slice(cursor);
      newCursor = cursor + sortedKey.length;
    }

    activeField.setValue(newValue);
    activeField.setCursorPos(newCursor);
    handleChange(newValue);
  };

  const handleClose = () => {
    onClose();
  };

  if (!showKeyboard) return null;

  if (isMobile)
    return (
      <div className="flex w-full pb-5 flex-col fixed bottom-0 gap-2 max-w-3xl bg-secondary-bg rounded-lg p-2 z-200 ">
        <div className="flex w-full justify-between pt-4 pb-3 px-2">
          <p className="font-medium text-gray-500 uppercase"> URH </p>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleClose();
            }}
            className="cursor-pointer hover:text-red-800"
          >
            <X size={24} />
          </button>
        </div>

        {page == "keys" && (
          <div className={`grid grid-cols-9 w-full gap-1 justify-between`}>
            {mobileKeys.map((singleKey) => (
              <button
                key={singleKey}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOnPress(singleKey);
                }}
                className={` text-foreground-50 w-full py-3 text-base hover:border-gray-txt-50/50 border border-gray-txt-50/15 shadow-md rounded-lg cursor-pointer`}
              >
                {caps ? singleKey.toUpperCase() : singleKey}
              </button>
            ))}
          </div>
        )}

        {page == "ipaV" && (
          <div className={`grid grid-cols-8 w-full gap-1 justify-between`}>
            {ipaVowels.map((singleKey) => (
              <button
                key={singleKey}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOnPress(singleKey);
                }}
                className={` text-foreground-50 w-full py-3 text-base hover:border-gray-txt-50/50 border border-gray-txt-50/15 shadow-md rounded-lg cursor-pointer`}
              >
                {caps ? singleKey.toUpperCase() : singleKey}
              </button>
            ))}
          </div>
        )}

        {page == "ipaC" && (
          <div className={`grid grid-cols-8 w-full gap-1 justify-between`}>
            {ipaConsonants.map((singleKey) => (
              <button
                key={singleKey}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOnPress(singleKey);
                }}
                className={` text-foreground-50 w-full py-3 text-base hover:border-gray-txt-50/50 border border-gray-txt-50/15 shadow-md rounded-lg cursor-pointer`}
              >
                {caps ? singleKey.toUpperCase() : singleKey}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-1 justify-between">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              setCaps(!caps);
            }}
            className={` ${
              caps
                ? "bg-foreground-50 text-secondary-bg"
                : "bg-transparent text-foreground-50"
            } py-3 text-base hover:border-gray-txt-50/50 border border-gray-txt-50/15 shadow-md px-5 rounded-lg cursor-pointer`}
          >
            ⇪
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              togglePage();
            }}
            className={`text-foreground-50 bg-transparent hover:border-gray-txt-50/50 border border-gray-txt-50/15 py-3 text-base shadow-md px-5 rounded-lg cursor-pointer`}
          >
            {page == "keys" ? "IPA" : "ABC"}
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleOnPress("space");
            }}
            className={`text-foreground-50 bg-transparent hover:border-gray-txt-50/50 border border-gray-txt-50/15 py-3 text-base shadow-md px-5 rounded-lg cursor-pointer flex-1`}
          >
            Uphẹ
          </button>

          {page != "keys" && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                toggleIPA();
              }}
              className={`text-foreground-50 bg-transparent hover:border-gray-txt-50/50 border border-gray-txt-50/15 py-3 text-base shadow-md px-5 rounded-lg cursor-pointer`}
            >
              {page == "ipaV" ? "1/2" : "2/2"}
            </button>
          )}

          {page != "keys" ? (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handleOnPress("•");
              }}
              className={`text-foreground-50 bg-transparent hover:border-gray-txt-50/50 border border-gray-txt-50/15 py-3 text-base shadow-md px-5 rounded-lg cursor-pointer`}
            >
              •
            </button>
          ) : (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handleOnPress("enter");
              }}
              className={`text-foreground-50 bg-transparent hover:border-gray-txt-50/50 border border-gray-txt-50/15 py-3 text-base shadow-md px-5 rounded-lg cursor-pointer`}
            >
              ⏎
            </button>
          )}
        </div>
      </div>
    );

  return (
    <motion.div
      drag
      className="flex flex-col absolute left-1/2 -translate-x-1/2 top-32 w-full cursor-grab gap-2 max-w-3xl bg-secondary-bg border border-slate-200 rounded-lg p-2 z-200 "
    >
      <div className="flex w-full justify-between p-2">
        <p className="font-medium text-white/90 uppercase"> URH </p>
        <div className="flex items-center gap-2 text-sm text-white/90">
          <GripVertical strokeWidth={1.5} size={20} className="h-4 w-4" />
          <span>{<LocaleWrapper item="common.moveKeyboard" />}</span>
        </div>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            handleClose();
          }}
          className="cursor-pointer hover:text-red-800"
        >
          <X size={26} />
        </button>
      </div>

      {page == "keys" && (
        <div className={`grid grid-cols-9 w-full gap-1 justify-between`}>
          {mobileKeys.map((singleKey) => (
            <button
              key={singleKey}
              onMouseDown={(e) => {
                e.preventDefault();
                handleOnPress(singleKey);
              }}
              className={`text-foreground-50 w-full py-3 text-base hover:border-gray-txt-50/50 border border-gray-txt-50/15 shadow-md rounded-lg cursor-pointer`}
            >
              {caps ? singleKey.toUpperCase() : singleKey}
            </button>
          ))}
        </div>
      )}

      {page == "ipaV" && (
        <div className={`grid grid-cols-8 w-full gap-1 justify-between`}>
          {ipaVowels.map((singleKey) => (
            <button
              key={singleKey}
              onMouseDown={(e) => {
                e.preventDefault();
                handleOnPress(singleKey);
              }}
              className={`text-foreground-50 w-full py-3 text-base hover:border-gray-txt-50/50 border border-gray-txt-50/15 shadow-md rounded-lg cursor-pointer`}
            >
              {caps ? singleKey.toUpperCase() : singleKey}
            </button>
          ))}
        </div>
      )}

      {page == "ipaC" && (
        <div className={`grid grid-cols-8 w-full gap-1 justify-between`}>
          {ipaConsonants.map((singleKey) => (
            <button
              key={singleKey}
              onMouseDown={(e) => {
                e.preventDefault();
                handleOnPress(singleKey);
              }}
              className={`text-foreground-50 w-full py-3 text-base hover:border-gray-txt-50/50 border border-gray-txt-50/15 shadow-md rounded-lg cursor-pointer`}
            >
              {caps ? singleKey.toUpperCase() : singleKey}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-1 justify-between">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            setCaps(!caps);
          }}
          className={`${
            caps
              ? "text-secondary-bg bg-foreground-50 uppercase"
              : "text-gray-txt-50 bg-secondary-bg"
          } py-3 text-base shadow-md hover:border-gray-txt-50/50 border border-gray-txt-50/15 px-5 rounded-lg cursor-pointer`}
        >
          ⇪
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            togglePage();
          }}
          className={`text-gray-txt-50 bg-secondary-bg py-3 text-base shadow-md hover:border-gray-txt-50/50 border border-gray-txt-50/15 px-5 rounded-lg cursor-pointer`}
        >
          {page == "keys" ? "IPA" : "ABC"}
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            handleOnPress("space");
          }}
          className={` text-gray-txt-50 py-3 text-base hover:border-gray-txt-50/50 border border-gray-txt-50/15 shadow-md px-5 rounded-lg cursor-pointer flex-1`}
        >
          Uphẹ
        </button>

        {/* {page == "keys" ? (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleOnPress("•");
            }}
            className={` text-gray-txt-50 py-3 text-base hover:border-gray-txt-50/50 border border-gray-txt-50/15 shadow-md px-5 rounded-lg cursor-pointer`}
          >
            •
          </button>
        ) : ( */}
        {page != "keys" && (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleIPA();
            }}
            className={`text-gray-txt-50 py-3 text-base hover:border-gray-txt-50/50 border border-gray-txt-50/15 shadow-md px-5 rounded-lg cursor-pointer`}
          >
            {page == "ipaV" ? "CONS" : "VOW"}
          </button>
        )}

        {page !== "keys" ? (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleOnPress("•");
            }}
            className={` text-gray-txt-50 py-3 text-base hover:border-gray-txt-50/50 border border-gray-txt-50/15 shadow-md px-5 rounded-lg cursor-pointer`}
          >
            •
          </button>
        ) : (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleOnPress("enter");
            }}
            className={`text-gray-txt-50 py-3 text-base hover:border-gray-txt-50/50 border border-gray-txt-50/15 shadow-md px-5 rounded-lg cursor-pointer`}
          >
            Ruo
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default CustomKeyboard;
