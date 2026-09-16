import moment from "moment";
import { WordRecord, SimpleRecord } from "../types";

export function transformWordRecords(results: WordRecord[]): SimpleRecord[] {
  return results.map((singleResult) => {
    let eng: string[] = [];
    let pos: string[] = [];
    let oto: string[] = [];
    let idje: string[] = [];

    singleResult.efaEng.forEach((item) => {
      eng = [...eng, item.otaWord];
      pos = [...pos, ...item.details.ekerota];
      oto = [...oto, item.details.oto];
      idje = [...idje, ...item.details.idje.map((ex) => ex.sentence)];
    });

    return {
      id: singleResult.id,
      ota: singleResult.ota,
      efaEng: eng,
      oho: singleResult.oho,
      pos,
      oto,
      idje,
      createdAt: moment(singleResult.createdAt).format("YYYY-MM-DD"),
      status: singleResult.status,
    };
  });
}
