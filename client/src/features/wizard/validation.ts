import * as yup from "yup";

export const nameRegex = /^[A-Za-zÄÖÜäöüß]+$/;
export const lastNameRegex = /^[A-Za-zÄÖÜäöüß]+(?:[ -][A-Za-zÄÖÜäöüß]+)*$/;

function calcAge(date: Date) {
  const today = new Date();
  let diffYear = today.getFullYear() - date.getFullYear();
  const diffMonth = today.getMonth() - date.getMonth();
  if (diffMonth < 0 || (diffMonth === 0 && today.getDate() < date.getDate()))
    diffYear--;
  return diffYear;
}

export const step1Schema = yup.object({
  firstName: yup
    .string()
    .matches(nameRegex, "Only latin and german symbols, single name")
    .required(),
  lastName: yup
    .string()
    .matches(lastNameRegex, "Only latin and german symbols")
    .required(),
  bdate: yup
    .date()
    .typeError("Invalid date")
    .required()
    .test("age", "Max age is 79", (v) => (v ? calcAge(v) <= 79 : false)),
});
export type Step1Form = yup.InferType<typeof step1Schema>;

export const step2Schema = yup.object({
  email: yup.string().email().required(),
  phone: yup
    .string()
    .matches(/^\+[1-9]\d{7,14}$/, "E.164 (+ and 8–15 digits)")
    .required(),
});
export type Step2Form = yup.InferType<typeof step2Schema>;

export const step3Schema = yup
  .object({
    loanAmount: yup
      .number()
      .typeError("number")
      .integer()
      .min(10000)
      .max(70000)
      .required(),
    upfront: yup.number().typeError("number").integer().min(0).required(),
    terms: yup
      .number()
      .typeError("number")
      .integer()
      .min(10)
      .max(30)
      .required(),
  })
  .test(
    "upfront<loan",
    "Upfront must be lower than loan amount",
    (o: any) => o.upfront < o.loanAmount
  );
export type Step3Form = yup.InferType<typeof step3Schema>;

export const step4Schema = yup.object({
  salary: yup
    .number()
    .typeError("number")
    .min(0)
    .required("Monthly salary is required"),
  hasExtra: yup.boolean().default(false),
  extraIncome: yup.number().typeError("number").min(0).notRequired(),
  hasMortgage: yup.boolean().default(false),
  mortgage: yup.number().typeError("number").min(0).notRequired(),
  hasCredits: yup.boolean().default(false),
  otherCredits: yup.number().typeError("number").min(0).notRequired(),
});
export type Step4Form = yup.InferType<typeof step4Schema>;
