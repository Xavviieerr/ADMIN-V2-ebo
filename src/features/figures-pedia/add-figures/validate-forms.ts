import { FigurePayload } from "../lib";
import { BasicInfo } from "./types";

export const validateBasicInfo = (data: BasicInfo) => {
  const errors: Partial<Record<keyof BasicInfo, string>> = {};

  if (!data.fullName) {
    errors.fullName = "Full name is required";
  }
  if (!data.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required";
  }
  //   if (!data.placeOfBirth) {
  //     errors.placeOfBirth = "Place of birth is required";
  //   }
  if (!data.gender) {
    errors.gender = "Gender is required";
  }
  //   if (!data.dod) {
  //     errors.dod = "Date of death is required";
  //   }
  //   if (!data.placeOfDeath) {
  //     errors.placeOfDeath = "Place of death is required";
  //   }
  //   if (!data.causeOfDeath) {
  //     errors.causeOfDeath = "Cause of death is required";
  //   }
  if (!data.introBio) {
    errors.introBio = "Figure Summary is required";
  }
  if (!data.profilePhoto) {
    errors.profilePhoto = "Profile photo is required";
  }
  if (!data.occupation) {
    errors.occupation = "Occupation is required";
  }
  //   if (!data.shortBio) {
  //     errors.shortBio = "Short bio is required";
  //   }
  if (!data.nationality) {
    errors.nationality = "Nationality is required";
  }
  // if (!data.region) {
  //   errors.region = "Region is required";
  // }
  // if (!data.era) {
  //   errors.era = "Era is required";
  // }
  // if (!data.ethnicity) {
  //   errors.ethnicity = "Ethnicity is required";
  // }
  // if (!data.occupation) {
  //   errors.occupation = "Occupation is required";
  // }
  // if (!data.religion) {
  //   errors.religion = "Religion is required";
  // }
  //   if (!data.suggestionNote) {
  //     errors.suggestionNote = "Suggestion note is required";
  //   }
  // if (!data.tags || data.tags.length == 0) {
  //   errors.tags = "Tags are required";
  // }
  //   if (!data.notableAchievements) {
  //     errors.notableAchievements = "Notable achievements are required";
  //   }

  return errors;
};

export const validateFamilyForm = (data: FigurePayload["family"][number]) => {
  const errors: Partial<Record<keyof FigurePayload["family"][number], string>> =
    {};

  if (!data.name) errors.name = "Name is required";
  if (!data.relationship) errors.relationship = "Relationship is required";
  if (!data.bio) errors.bio = "Bio is required";

  if (data.relationship === "spouse" || data.relationship === "ex_spouse") {
    if (!data.marriageYear) errors.marriageYear = "Marriage year is required";
  }

  if (data.relationship === "ex_spouse") {
    if (!data.divorceYear) errors.divorceYear = "Divorce year is required";
  }

  return errors;
};

export const validateMetaData = (
  data: FigurePayload["externalLinks"][number],
) => {
  const errors: Partial<
    Record<keyof FigurePayload["externalLinks"][number], string>
  > = {};

  if (!data.title) errors.title = "Title is required";
  if (data.type == "website" && !data.url) errors.url = "Url is required";
  if (data.type !== "website") {
    // if (!data.creator) errors.creator = "Creator is required";
    if (!data.source) errors.source = "Source is required";
    // if (!data.description) errors.description = "Description is required";
  }

  if (!data.date) errors.date = "Date is required";

  return errors;
};
